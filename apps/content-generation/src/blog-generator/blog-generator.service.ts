import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
  private currentCategoryIndex = 0;
  private model;

  constructor(
    @Inject('CONTENT_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    const genAI = new GoogleGenerativeAI(
      'AIzaSyAQNa7n3Co6LxhKCjG3hNNR5INEb-7dZ9A',
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const blogPost = await this.generateBlogPost();
    this.client.emit('blog_created', blogPost);
    return blogPost;
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
    const category = this.categories[this.currentCategoryIndex];
    this.currentCategoryIndex =
      (this.currentCategoryIndex + 1) % this.categories.length;
    return category;
  }

  async generateTitle(category: string) {
    try {
      const currentDate = new Date().toISOString();
      const prompt = `Generate a creative and unique blog title about ${category} that will attract readers' attention. 
                      Make sure it's different from any previous titles. 
                      Consider current trends and the date (${currentDate}) for inspiration. 
                      Return just a single short sentence title.`;
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2,
        },
      });
      const title = result.response.text().trim();
      return title || 'Default Blog Title';
    } catch (error) {
      console.error('Error generating title:', error);
      return 'Default Blog Title';
    }
  }

  async generateContent(category: string, title: string) {
    try {
      const currentDate = new Date().toISOString();
      const prompt = `Write an extremely comprehensive, in-depth, and long blog post about ${category}. 
                      The title of the blog is "${title}". 
                      Follow these guidelines:
                      1. Start with an engaging introduction.
                      2. Divide the content into at least 5-7 main sections, each with 2-3 subsections.
                      3. Include real-world examples, case studies, or data to support your points.
                      4. Discuss current trends and future predictions related to the topic.
                      5. Address common questions or misconceptions about the subject.
                      6. Provide actionable tips or advice for readers.
                      7. Include a detailed conclusion summarizing key points and encouraging further exploration.
                      8. Aim for a word count of at least 1000 words.
                      9. Don't write it in list or bullet listed manner unless it is very necessary. make it just sweet like a medium blog post that users will love. Ensure the content is fresh, not repetitive, and offers unique insights.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100000,
          temperature: 0.7,
        },
      });

      let content = result.response.text().trim();

      return content || 'Default blog content...';
    } catch (error) {
      console.error('Error generating content:', error);
      return 'Default blog content...';
    }
  }

  async fetchImage(query: string) {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random`,
        {
          params: {
            query,
            client_id: 'RACJEMbqEpyn3bixXktez6N7ilIX9r9nQK-v0DGk6U8',
          },
        },
      );
      return response.data.urls?.regular || 'default-image-url';
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'default-image-url';
    }
  }
}
