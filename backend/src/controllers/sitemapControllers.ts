import { Request, Response } from 'express';
import { create } from 'xmlbuilder2';
import { Category } from '../models/Categories';
import { Service } from "../models/Service";

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const baseUrl = 'https://housexpertz.in'; // Replace with your actual domain

        // 1. Fetch all data concurrently for speed
        const [categories, services] = await Promise.all([
            Category.find({}, 'slug updatedAt').lean(),
            Service.find({}, 'slug updatedAt').populate('category', 'slug').lean()
        ]);

        // 2. Initialize the XML structure
        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

        // 3. Add Static Pages (Home, etc.)
        root.ele('url')
            .ele('loc').txt(`${baseUrl}/`).up()
            .ele('lastmod').txt(new Date().toISOString()).up()
            .ele('priority').txt('1.0').up();

        // 4. Add Category Pages
        categories.forEach((cat: any) => {
            root.ele('url')
                .ele('loc').txt(`${baseUrl}/all-services?category=${cat.slug}`).up()
                .ele('lastmod').txt(new Date(cat.updatedAt).toISOString()).up()
                .ele('changefreq').txt('weekly').up()
                .ele('priority').txt('0.8').up();
        });

        // 5. Add Service Detail Pages
        services.forEach((service: any) => {
            // Ensure we have the category slug for the URL if needed
            const catSlug = (service.category as any)?.slug || 'general';
            
            root.ele('url')
                .ele('loc').txt(`${baseUrl}/service-details?category=${catSlug}&service=${service.slug}`).up()
                .ele('lastmod').txt(new Date(service.updatedAt).toISOString()).up()
                .ele('changefreq').txt('monthly').up()
                .ele('priority').txt('0.6').up();
        });

        // 6. Convert to XML string
        const xml = root.end({ prettyPrint: true });

        // 7. Send Response with XML Header
        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('Error generating sitemap');
    }
};