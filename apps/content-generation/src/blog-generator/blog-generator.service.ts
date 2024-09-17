import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BlogGeneratorService {
  private categories = [
    'Tech',
    'Health',
    'Science',
    'History',
    'Business',
    'Art & Culture',
  ];
  private usedCategories: string[] = [];

  constructor(
    @Inject('CONTENT_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  //   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const blogPost = await this.generateBlogPost();
    this.client.emit('blog_created', blogPost);
  }

  async generateBlogPost() {
    const category = this.getNextCategory();
    const title = await this.generateTitle(category);
    const content = await this.generateContent(category, title);
    const image = await this.fetchImage(title);

    return {
      title,
      image,
      category,
      content,
    };
  }

  getNextCategory() {
    if (this.usedCategories.length === this.categories.length) {
      // reset if all categories have been used
      this.usedCategories = [];
    }

    // find the first unused category
    const availableCategories = this.categories.filter(
      (category) => !this.usedCategories.includes(category),
    );
    const nextCategory = availableCategories[0]; // select the first unused category

    // mark this category as used
    this.usedCategories.push(nextCategory);

    return nextCategory;
  }

  async generateTitle(category: string) {
    const response = await axios.post(
      'https://gemini-api-url/generate',
      {
        prompt: `Give me a creative blog title about ${category} that will attract readers' attention.`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('GEMINI_API_KEY')}`,
        },
      },
    );

    return response.data.title || 'Default Blog Title';
  }

  async generateContent(category: string, title: string) {
    const response = await axios.post(
      'https://gemini-api-url/generate',
      {
        prompt: `Write a long, professional blog post about ${category}. The title of the blog is "${title}". Make it simple and human-sounding.`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('GEMINI_API_KEY')}`,
        },
      },
    );

    return response.data.content || 'Default blog content...';
  }

  async fetchImage(query: string) {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        query,
        client_id: this.configService.get('UNSPLASH_API_KEY'),
      },
    });

    return response.data.urls?.regular || 'default-image-url';
  }
}
