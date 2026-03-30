import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { withAuth } from '@/lib/auth';
import { submitToIndexNow } from '@/lib/indexnow';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      Blog.find(filter).sort({ is_featured: -1, created_at: -1 }).skip(offset).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data: { data, total, page, limit } });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();

    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const existing = await Blog.findOne({ slug });
      if (existing) {
        let counter = 1;
        while (await Blog.findOne({ slug: `${slug}-${counter}` })) {
          counter++;
        }
        slug = `${slug}-${counter}`;
      }
    }

    const blog = await Blog.create({
      title: body.title,
      subtitle: body.subtitle || '',
      slug,
      category: body.category || 'General',
      tags: body.tags || [],
      content_raw: body.content_raw || body.content || '',
      content_html: body.content_html || '',
      featured_image: body.featured_image || body.coverImage || '',
      seo_title: body.seo_title || '',
      meta_description: body.meta_description || '',
      cta_type: body.cta_type || '',
      cta_button_text: body.cta_button_text || '',
      cta_link: body.cta_link || '',
      cta_description: body.cta_description || '',
      status: body.status || 'draft',
      is_featured: body.is_featured || false,
      publish_date: body.status === 'published' ? new Date() : null,
      author: body.author || 'PropelusAI Team',
      read_time: body.read_time || 0,
    });

    // Notify search engines via IndexNow when blog is published
    if (blog.status === 'published' && blog.slug) {
      submitToIndexNow(`/blogs/${blog.slug}`).catch(() => {});
    }

    return NextResponse.json({ success: true, data: blog, message: 'Blog created' }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});
