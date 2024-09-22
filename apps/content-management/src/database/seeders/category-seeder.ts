import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'apps/content-management/schemas/category.schema';
@Injectable()
export class CategorySeeder {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async seed() {
    const categories = [
      {
        name: 'Technology',
        image:
          'https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg',
        subcategories: [
          'Artificial Intelligence',
          'Blockchain',
          'Internet of Things',
          'Cybersecurity',
          'Cloud Computing',
        ],
      },
      {
        name: 'Health',
        image:
          'https://thumbs.dreamstime.com/b/good-health-good-life-female-hand-chalk-writing-text-blue-background-97044786.jpg',
        subcategories: [
          'Nutrition',
          'Mental Health',
          'Fitness',
          'Medical Breakthroughs',
          'Holistic Wellness',
        ],
      },
      {
        name: 'Science',
        image:
          'https://static.vecteezy.com/system/resources/thumbnails/022/006/725/small_2x/science-background-illustration-scientific-design-flasks-glass-and-chemistry-physics-elements-generative-ai-photo.jpeg',
        subcategories: [
          'Astronomy',
          'Quantum Physics',
          'Genetics',
          'Climate Science',
          'Neuroscience',
        ],
      },
      {
        name: 'History',
        image:
          'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/777df722-d114-4a6f-b451-88c4224a8658/c868100d-2e9c-4c5e-96e1-44416bf61a46.png',
        subcategories: [
          'Ancient Civilizations',
          'World Wars',
          'Cultural Revolutions',
          'Archaeological Discoveries',
          'Historical Figures',
        ],
      },
      {
        name: 'Business',
        image:
          'https://www.openaccessgovernment.org/wp-content/uploads/2019/01/dreamstime_s_107016485.jpg',
        subcategories: [
          'Entrepreneurship',
          'Marketing',
          'Finance',
          'Leadership',
          'Innovation',
        ],
      },
      {
        name: 'Art & Culture',
        image:
          'https://news.ubc.ca/wp-content/uploads/2023/08/AdobeStock_559145847.jpeg',
        subcategories: [
          'Contemporary Art',
          'World Literature',
          'Film Analysis',
          'Music Theory',
          'Cultural Anthropology',
        ],
      },
      {
        name: 'Environment',
        image:
          'https://thumbs.dreamstime.com/b/earth-globe-covered-green-plants-trees-symbolizing-ecological-balance-care-environment-313903589.jpg',
        subcategories: [
          'Sustainability',
          'Renewable Energy',
          'Wildlife Conservation',
          'Urban Planning',
          'Ocean Preservation',
        ],
      },
      {
        name: 'Education',
        image:
          'https://www.managedoutsource.com/wp-content/uploads/2023/06/artificial-intelligence-is-transforming-the-education-industry.jpg',
        subcategories: [
          'E-learning',
          'Educational Psychology',
          'STEM Education',
          'Alternative Schooling',
          'Lifelong Learning',
        ],
      },
      {
        name: 'Travel',
        image:
          'https://images.prismic.io//intuzwebsite/f63cef29-f9fc-4b43-8340-440b2b30484a_Banner%402x.png?w=2400&q=80&auto=format,compress&fm=png8',
        subcategories: [
          'Adventure Tourism',
          'Cultural Immersion',
          'Sustainable Travel',
          'Digital Nomadism',
          'Culinary Tourism',
        ],
      },
      {
        name: 'Psychology',
        image:
          'https://media.licdn.com/dms/image/D4D12AQGlbMrfDXhuJQ/article-cover_image-shrink_720_1280/0/1697895641174?e=2147483647&v=beta&t=xuVYgYjPXQFdKXeaXsHAXmZwz9x-4w8L-wASb6ebAc0',
        subcategories: [
          'Cognitive Psychology',
          'Child Development',
          'Positive Psychology',
          'Behavioral Economics',
          'Social Psychology',
        ],
      },
    ];

    for (const category of categories) {
      await this.categoryModel.findOneAndUpdate(
        { name: category.name },
        { $set: { ...category, image: category.image } },
        { upsert: true, new: true },
      );
    }

    console.log('Categories seeded successfully');
  }
}
