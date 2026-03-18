import { NextResponse } from 'next/server';
import { curriculumData } from '@/utils/curriculumData';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const staticResults: { type: string; title: string; id: string; href: string; category: string }[] = [];

  // Search static curriculum (Tracks & Topics)
  for (const trackId in curriculumData) {
    const track = curriculumData[trackId];
    const trackMatches = track.title.toLowerCase().includes(query) || track.description.toLowerCase().includes(query);
    
    if (trackMatches) {
      staticResults.push({ 
        type: 'track', 
        title: track.title, 
        id: track.id, 
        href: `/curriculum/${track.id}`,
        category: 'Learning Track'
      });
    }

    for (const topic of track.topics) {
      if (topic.title.toLowerCase().includes(query) || topic.description.toLowerCase().includes(query)) {
        // Find first available difficulty for this topic
        const difficulty = (['Beginner', 'Intermediate', 'Advanced', 'Pro'] as const).find(
          d => topic.difficulties[d].length > 0
        ) || 'Beginner';

        staticResults.push({ 
          type: 'topic', 
          title: topic.title, 
          id: topic.id, 
          href: `/curriculum/${track.id}/${difficulty}/${topic.id}`,
          category: 'Specialization'
        });
      }
    }
  }

  // Search Database (Generated Lessons)
  try {
    const supabase = await createClient();
    const { data: dbLessons } = await supabase
      .from('generated_lessons')
      .select('id, topic, status')
      .ilike('topic', `%${query}%`)
      .limit(5);

    const dynamicResults = (dbLessons || []).map((lesson: { id: string; topic: string; status: string }) => ({
      type: 'lesson',
      title: lesson.topic,
      id: lesson.id,
      href: `/lesson/${lesson.id}`,
      category: 'Generated Module',
      status: lesson.status
    }));

    return NextResponse.json({ 
      results: [...staticResults, ...dynamicResults].slice(0, 10) 
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ results: staticResults });
  }
}
