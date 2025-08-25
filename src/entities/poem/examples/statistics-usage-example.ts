// Example of using Poem-Statistics one-to-one relationship
import { poemRepository } from '@/entities/poem';

// Example 1: Creating a poem with initial statistics
export async function createPoemWithStatistics() {
  try {
    const newPoem = await poemRepository.create({
      title: 'My First Poem',
      slug: 'my-first-poem',
      content: { ops: [{ insert: 'This is my first poem content.' }] },
      authorId: 'user-id-here',
      description: 'A beautiful poem about life',
      statistics: {
        create: {
          views: 0,
          edits: 0,
          likes: 0,
          shares: 0,
        },
      },
    });

    console.log('Poem created with statistics:', newPoem.id);
    return newPoem;
  } catch (error) {
    console.error('Error creating poem with statistics:', error);
    throw error;
  }
}

// Example 2: Incrementing poem statistics
export async function trackPoemActivity(poemId: string) {
  try {
    // Simulate user viewing the poem
    await poemRepository.incrementViews(poemId);
    console.log('View count incremented for poem:', poemId);

    // Simulate user liking the poem
    await poemRepository.incrementLikes(poemId);
    console.log('Like count incremented for poem:', poemId);

    // Simulate user sharing the poem
    await poemRepository.incrementShares(poemId);
    console.log('Share count incremented for poem:', poemId);

    // Simulate poem being edited
    await poemRepository.incrementEdits(poemId);
    console.log('Edit count incremented for poem:', poemId);
  } catch (error) {
    console.error('Error tracking poem activity:', error);
    throw error;
  }
}

// Example 3: Retrieving poem with statistics
export async function getPoemWithStats(poemId: string) {
  try {
    const poem = await poemRepository.findById(poemId);

    if (!poem) {
      console.log('Poem not found:', poemId);
      return null;
    }

    const stats = poem.statistics;
    console.log(`Poem: "${poem.title}"`);
    console.log(`Views: ${stats?.views || 0}`);
    console.log(`Likes: ${stats?.likes || 0}`);
    console.log(`Shares: ${stats?.shares || 0}`);
    console.log(`Edits: ${stats?.edits || 0}`);

    return poem;
  } catch (error) {
    console.error('Error retrieving poem with statistics:', error);
    throw error;
  }
}

// Example 4: Getting popular poems (sorted by views)
export async function getPopularPoems(limit: number = 10) {
  try {
    const popularPoems = await poemRepository.findAll({
      take: limit,
      orderBy: {
        statistics: {
          views: 'desc',
        },
      },
    });

    console.log(`Found ${popularPoems.length} popular poems:`);
    popularPoems.forEach((poem, index) => {
      const views = poem.statistics?.views || 0;
      console.log(`${index + 1}. "${poem.title}" - ${views} views`);
    });

    return popularPoems;
  } catch (error) {
    console.error('Error retrieving popular poems:', error);
    throw error;
  }
}

// Example 5: Updating poem statistics manually
export async function updatePoemStatistics(
  poemId: string,
  updates: {
    views?: number;
    likes?: number;
    shares?: number;
    edits?: number;
  }
) {
  try {
    const updatedPoem = await poemRepository.update(poemId, {
      statistics: {
        update: updates,
      },
    });

    console.log('Poem statistics updated:', updatedPoem.id);
    return updatedPoem;
  } catch (error) {
    console.error('Error updating poem statistics:', error);
    throw error;
  }
}

// Example 6: Bulk statistics operations
export async function bulkIncrementViews(poemIds: string[]) {
  try {
    console.log(`Incrementing views for ${poemIds.length} poems...`);

    const promises = poemIds.map(poemId => poemRepository.incrementViews(poemId));

    await Promise.all(promises);
    console.log('Bulk view increment completed');
  } catch (error) {
    console.error('Error in bulk view increment:', error);
    throw error;
  }
}

// Example 7: Statistics analytics
export async function getPoemAnalytics(poemId: string) {
  try {
    const poem = await poemRepository.findById(poemId);

    if (!poem || !poem.statistics) {
      console.log('Poem or statistics not found:', poemId);
      return null;
    }

    const stats = poem.statistics;
    const totalInteractions = stats.views + stats.likes + stats.shares;
    const engagementRate = totalInteractions > 0 ? (stats.likes / stats.views) * 100 : 0;

    const analytics = {
      poemId,
      title: poem.title,
      totalViews: stats.views,
      totalLikes: stats.likes,
      totalShares: stats.shares,
      totalEdits: stats.edits,
      totalInteractions,
      engagementRate: Math.round(engagementRate * 100) / 100, // Round to 2 decimal places
      averageViewsPerDay: 0, // Would need to calculate based on creation date
    };

    console.log('Poem Analytics:', analytics);
    return analytics;
  } catch (error) {
    console.error('Error getting poem analytics:', error);
    throw error;
  }
}

// Example 8: Simulating real-world usage
export async function simulatePoemUsage(poemId: string) {
  try {
    console.log('Simulating poem usage...');

    // Simulate multiple users viewing the poem
    for (let i = 0; i < 5; i++) {
      await poemRepository.incrementViews(poemId);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }

    // Simulate some users liking the poem
    for (let i = 0; i < 3; i++) {
      await poemRepository.incrementLikes(poemId);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Simulate one user sharing the poem
    await poemRepository.incrementShares(poemId);

    // Simulate poem being edited once
    await poemRepository.incrementEdits(poemId);

    console.log('Poem usage simulation completed');

    // Get final statistics
    const finalStats = await getPoemWithStats(poemId);
    return finalStats;
  } catch (error) {
    console.error('Error simulating poem usage:', error);
    throw error;
  }
}

// Example 9: Checking statistics before operations
export async function safeIncrementViews(poemId: string) {
  try {
    // First check if poem exists
    const poem = await poemRepository.findById(poemId);

    if (!poem) {
      console.log('Poem not found, cannot increment views:', poemId);
      return false;
    }

    // Increment views
    await poemRepository.incrementViews(poemId);
    console.log('Views safely incremented for poem:', poemId);
    return true;
  } catch (error) {
    console.error('Error in safe view increment:', error);
    return false;
  }
}

// Example 10: Statistics comparison between poems
export async function comparePoemStatistics(poemIds: string[]) {
  try {
    const poems = await Promise.all(poemIds.map(id => poemRepository.findById(id)));

    const validPoems = poems.filter(poem => poem !== null);

    if (validPoems.length === 0) {
      console.log('No valid poems found for comparison');
      return null;
    }

    const comparison = validPoems.map(poem => ({
      id: poem!.id,
      title: poem!.title,
      views: poem!.statistics?.views || 0,
      likes: poem!.statistics?.likes || 0,
      shares: poem!.statistics?.shares || 0,
      edits: poem!.statistics?.edits || 0,
      totalInteractions:
        (poem!.statistics?.views || 0) +
        (poem!.statistics?.likes || 0) +
        (poem!.statistics?.shares || 0),
    }));

    // Sort by total interactions
    comparison.sort((a, b) => b.totalInteractions - a.totalInteractions);

    console.log('Poem Statistics Comparison:');
    comparison.forEach((poem, index) => {
      console.log(`${index + 1}. "${poem.title}"`);
      console.log(
        `   Views: ${poem.views}, Likes: ${poem.likes}, Shares: ${poem.shares}, Edits: ${poem.edits}`
      );
      console.log(`   Total Interactions: ${poem.totalInteractions}`);
    });

    return comparison;
  } catch (error) {
    console.error('Error comparing poem statistics:', error);
    throw error;
  }
}
