import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'apps/content-generation/schemas/category.schema';
@Injectable()
export class CategorySeeder {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async seed() {
    const categories = [
      {
        name: 'Technology',
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
        { $set: category },
        { upsert: true, new: true },
      );
    }

    console.log('Categories seeded successfully');
  }
}
