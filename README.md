{\rtf1}
# BookExplorer - Modern Book Discovery Platform

BookExplorer is a full-stack web application for discovering, searching, and exploring books across various categories. Built with modern web technologies, it provides real-time book data scraping, advanced search capabilities, and a seamless user experience.

##  REquirements
    Next.js v15.5.4 
    Nest.js v10.4.9


##  Architecture Overview
PRODUCT-DATA-EXPLORER/
├── frontend/
├── backend/
└── README.md
             Frontend Architecture
                    frontend/
                        ├── app/
                        │   ├── categories/
                        │   │   ├── [slug]/
                        │   │   │   └── page.tsx
                        │   │   └── page.tsx
                        │   ├── products/
                        │   │   ├── [id]/
                        │   │   │   └── page.tsx
                        │   │   └── page.tsx
                        │   ├── search/
                        │   │   └── page.tsx
                        │   ├── wishlist/
                        │   │   └── page.tsx
                        │   ├── favicon.ico
                        │   ├── globals.css
                        │   ├── layout.tsx
                        │   └── page.tsx
                        ├── components/
                        ├── lib/
                        │   ├── api.ts
                        │   └── searchUtils.ts
                        ├── node_modules/
                        ├── public/
                        ├── types/
                        ├── .env.local
                        ├── .gitignore
                        ├── eslint.config.mjs
                        ├── global.d.ts
                        ├── next-env.d.ts
                        ├── next.config.js
                        ├── package-lock.json
                        ├── package.json
                        ├── postcss.config.js
                        └── postcss.config.mjs

            Backend Architecture
                    backend/
                    ├── .next/
                    ├── dist/
                    ├── node_modules/
                    ├── src/
                    │   ├── controllers/
                    │   │   ├── auth.controller.ts
                    │   │   ├── categories.controller.ts
                    │   │   ├── debug.controller.ts
                    │   │   ├── navigation.controller.ts
                    │   │   ├── products.controller.ts
                    │   │   ├── reviews.controller.ts
                    │   │   ├── view-history.controller.ts
                    │   │   └── wishlist.controller.ts
                    │   ├── dto/
                    │   │   ├── auth.dto.ts
                    │   │   └── wishlist.dto.ts
                    │   ├── entities/
                    │   │   ├── book.entity.ts
                    │   │   ├── category.entity.ts
                    │   │   ├── navigation.entity.ts
                    │   │   ├── product-detail.entity.ts
                    │   │   ├── product.entity.ts
                    │   │   ├── review.entity.ts
                    │   │   ├── scrape-job.entity.ts
                    │   │   ├── user.entity.ts
                    │   │   ├── view-history.entity.ts
                    │   │   └── wishlist.entity.ts
                    │   ├── guards/
                    │   │   └── jwt-auth.guard.ts
                    │   ├── modules/
                    │   │   ├── categories.module.ts
                    │   │   ├── navigation.module.ts
                    │   │   ├── products.module.ts
                    │   │   ├── reviews.module.ts
                    │   │   ├── view-history.module.ts
                    │   │   └── wishlist.module.ts
                    │   ├── services/
                    │   │   ├── auth.service.ts
                    │   │   ├── cache.service.ts
                    │   │   ├── categories.service.ts
                    │   │   ├── navigation.service.ts
                    │   │   ├── product-detail.service.ts
                    │   │   ├── products.service.ts
                    │   │   ├── review.service.ts
                    │   │   ├── scraping.service.ts
                    │   │   ├── view-history.service.ts
                    │   │   └── wishlist.service.ts
                    │   ├── strategies/
                    │   │   └── jwt.strategy.ts
                    │   ├── app.controller.ts
                    │   ├── app.module.ts
                    │   └── main.ts
                    ├── storage/
                    ├── .env
                    ├── .env.example
                    ├── database.sqlite
                    ├── package-lock.json
                    ├── package.json
                    └── tsconfig.json

Database:
database is connected to the cloudstorage(supabase.com)
    
