"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const navigation_controller_1 = require("./navigation.controller");
const navigation_service_1 = require("./navigation.service");
const navigation_entity_1 = require("../../entities/navigation.entity");
const scraping_service_1 = require("../../services/scraping.service");
let NavigationModule = class NavigationModule {
};
exports.NavigationModule = NavigationModule;
exports.NavigationModule = NavigationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([navigation_entity_1.Navigation])],
        controllers: [navigation_controller_1.NavigationController],
        providers: [navigation_service_1.NavigationService, scraping_service_1.ScrapingService],
        exports: [navigation_service_1.NavigationService],
    })
], NavigationModule);
//# sourceMappingURL=navigation.module.js.map