/**
 * Blog post config: slug -> titleKey (for t('blog.articleN')) and body paragraphs.
 * Used by app/blog/[slug]/page.jsx and BlogSection.
 */
export const BLOG_SLUGS = [
  'benefits-of-less-oil',
  'how-we-source-ingredients',
  'weekly-menu-highlights',
  'story-behind-dal-tadka',
  'meal-prep-vs-home-delivery',
];

const BLOG_POSTS = {
  'benefits-of-less-oil': {
    titleKey: 'article1',
    body: [
      'Eating less oil is one of the simplest ways to feel lighter and healthier without giving up flavour. At HomieBites, we cook with about 50% less oil than typical tiffin services or restaurants.',
      'Less oil means easier digestion, better heart health, and more room for the real taste of ingredients—dal, sabzi, and roti shine through. Many of our customers order specifically for weight management or digestive comfort.',
      'You don’t have to choose between “healthy” and “tasty.” Our home-style recipes use traditional tempering and spices so every meal still feels satisfying—just without the heavy, oily after-feel.',
    ],
  },
  'how-we-source-ingredients': {
    titleKey: 'article2',
    body: [
      'We believe good food starts with good ingredients. Every morning we buy fresh vegetables from the local sabzi mandi—the same way a home kitchen would. No bulk freezer stocks, no long supply chains.',
      'We use the same atta, dal, and spices you’d pick up from your neighbourhood store. Pure ghee, traditional masalas, and no MSG or preservatives. What we cook for you is what we’re happy to eat ourselves.',
      'Sourcing locally and daily keeps our food fresh, supports nearby vendors, and lets us cook in small batches. That’s how we keep the quality and taste consistent, one tiffin at a time.',
    ],
  },
  'weekly-menu-highlights': {
    titleKey: 'article3',
    body: [
      'Our menu changes with the season and what’s fresh at the market. You’ll see familiar home favourites—dal tadka, aloo gobi, bhindi, paneer dishes, seasonal sabzis—rotated so there’s variety without complexity.',
      'We focus on balanced, wholesome meals: roti, dal, sabzi, and rice in proportions that fill you up without leaving you heavy. Extra rotis, raita, or salad can be added on request.',
      'Want to know what’s on this week? WhatsApp us or check our gallery and pricing page. We’re happy to help you plan your orders around your schedule and preferences.',
    ],
  },
  'story-behind-dal-tadka': {
    titleKey: 'article4',
    body: [
      'Dal tadka is one of those dishes that feels like home no matter where you are. Our version comes from the same tradition many Indian households grow up with—toor dal, gentle spices, and a final tempering of ghee, cumin, and garlic.',
      'We don’t over-spice or over-oil it. The idea is to let the dal and the tadka do the talking: creamy, comforting, and perfect with roti or rice. It’s a staple on our menu because our customers ask for it again and again.',
      'If you’ve been missing a simple, honest dal like the one at home, we’d love for you to try ours. Cooked fresh every day in our home kitchen in Panchsheel Greens—no reheats, no shortcuts.',
    ],
  },
  'meal-prep-vs-home-delivery': {
    titleKey: 'article5',
    body: [
      'Meal prep can save money, but it costs time: planning, shopping, chopping, cooking, and cleaning. For busy professionals and families, those hours are hard to find every week.',
      'With HomieBites, you get fresh, home-style meals without the prep. We cook daily in small batches, so you’re not eating the same reheated meal for days. Portions are balanced, oil is minimal, and the taste is the kind you’d expect at home.',
      'When you add up grocery bills, time spent in the kitchen, and the cost of eating out, a tiffin service like ours often works out cheaper and far more convenient. Plus, you can order per meal or subscribe monthly with a 7% discount—no long-term commitment required.',
    ],
  },
};

export function getBlogPost(slug) {
  return BLOG_POSTS[slug] ?? null;
}

export function getAllBlogSlugs() {
  return BLOG_SLUGS;
}
