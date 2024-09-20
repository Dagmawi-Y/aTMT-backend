import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'apps/content-generation/schemas/category.schema';

@Injectable()
export class BlogGeneratorService {
  private model;

  constructor(
    @Inject('CONTENT_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GOOGLE_GEMINI_API_KEY'),
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    console.log('Blog generation started...');
    try {
      const blogPost = await this.generateBlogPost();
      this.client.emit('blog_created', blogPost);
      console.log('Blog post created and sent to content management service');
      return blogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  }

  async generateBlogPost() {
    const { category, subCategory } =
      await this.getRandomCategoryAndsubCategory();
    const title = await this.generateTitle(category, subCategory);
    const content = await this.generateContent(category, subCategory, title);
    const image = await this.fetchImage(title);

    return {
      title,
      image,
      category,
      subCategory,
      content,
    };
  }

  async getRandomCategoryAndsubCategory() {
    const count = await this.categoryModel.countDocuments();
    const random = Math.floor(Math.random() * count);
    const category = await this.categoryModel.findOne().skip(random);

    const subCategory =
      category.subcategories[
        Math.floor(Math.random() * category.subcategories.length)
      ];

    return { category: category.name, subCategory };
  }

  async generateTitle(category: string, subCategory: string) {
    try {
      const prompt = `Craft an engaging and original blog title related to ${category}, specifically focusing on ${subCategory}. The title should evoke curiosity and be suitable for a diverse audience. Consider what might catch a reader's eye on social media or in search results. Limit the title to a single sentence, and ensure it's distinct from any prior titles you've generated.`;
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 60,
          temperature: 1.5,
        },
      });
      const title = result.response.text().trim();
      return title;
    } catch (error) {
      console.error('Error generating title:', error);
    }
  }

  async generateContent(category: string, subCategory: string, title: string) {
    try {
      const prompt = `Write an extremely comprehensive, in-depth, and long blog post about "${title}" focusing on ${subCategory} within the ${category} category. 
                      Follow these guidelines:
                      1. Start with an engaging introduction that hooks the reader.
                      2. Divide the content into at least 5-7 main sections, each with 2-3 subsections.
                      3. Include real-world examples, case studies, or data to support your points.
                      4. Discuss current trends and future predictions related to the topic.
                      5. Address common questions or misconceptions about the subject.
                      6. Provide actionable tips or advice for readers.
                      7. Include a detailed conclusion summarizing key points and encouraging further exploration.
                      8. Aim for a word count of at least 1500 words.
                      9. Write in paragraphs and include lists only when necessary. Make it engaging like a high-quality Medium blog post.
                      10. Ensure the content is fresh, not repetitive, and offers unique insights that haven't been covered in previous posts.
                      11. Use simple English and common words so that anyone can understand it.
                      12. Incorporate the latest developments or research in the field of ${subCategory}.
                      13. Consider different perspectives or approaches to the topic.
                      14. Add a personal touch or anecdote to make the content more relatable.
                      15. Include a call-to-action at the end, encouraging readers to engage with the topic further.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100000,
          temperature: 1,
        },
      });

      let content = result.response.text().trim();

      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      // return `Default blog content about ${subCategory} in ${category}...`;
    }
  }

  async fetchImage(query: string) {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random`,
        {
          params: {
            query,
            client_id: this.configService.get('UNSPLASH_ACCESS_KEY'),
          },
        },
      );
      return response.data.urls?.regular;
    } catch (error) {
      console.error('Error fetching image:', error);
      // return 'default-image-url';
    }
  }
}
