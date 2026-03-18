import { Request, Response } from 'express';
import { create } from 'xmlbuilder2';
import { Category } from '../models/Categories';
import { Service } from "../models/Service";

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const baseUrl = 'https://housexpertz.in';

        // 1. Fetch data
        const [categories, services] = await Promise.all([
            Category.find({}, 'slug updatedAt').lean(),
            Service.find({}, 'slug updatedAt').lean()
        ]);

        // 2. Initialize XML
        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

        // 3. Static Pages
        const staticPages = ['', '/categories', '/contact', '/blogs', '/providers'];
        staticPages.forEach(path => {
            root.ele('url')
                .ele('loc').txt(`${baseUrl}${path}`).up()
                .ele('lastmod').txt(new Date().toISOString()).up()
                .ele('priority').txt(path === '' ? '1.0' : '0.7').up();
        });

        // 4. Category Pages (Updated to match /services/:categorySlug)
        categories.forEach((cat: any) => {
            root.ele('url')
                .ele('loc').txt(`${baseUrl}/services/${cat.slug}`).up()
                .ele('lastmod').txt(new Date(cat.updatedAt).toISOString()).up()
                .ele('changefreq').txt('weekly').up()
                .ele('priority').txt('0.8').up();
        });

        // 5. Service Detail Pages (Updated to match /service/:serviceSlug)
        services.forEach((service: any) => {
            root.ele('url')
                .ele('loc').txt(`${baseUrl}/service/detail/${service.slug}`).up()
                .ele('lastmod').txt(new Date(service.updatedAt).toISOString()).up()
                .ele('changefreq').txt('monthly').up()
                .ele('priority').txt('0.9').up(); // Boosted priority for individual services
        });

        const xml = root.end({ prettyPrint: true });

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('Error generating sitemap');
    }
};