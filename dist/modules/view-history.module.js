"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const view_history_controller_1 = require("../controllers/view-history.controller");
const view_history_service_1 = require("../services/view-history.service");
const view_history_entity_1 = require("../entities/view-history.entity");
let ViewHistoryModule = class ViewHistoryModule {
};
exports.ViewHistoryModule = ViewHistoryModule;
exports.ViewHistoryModule = ViewHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([view_history_entity_1.ViewHistory])],
        controllers: [view_history_controller_1.ViewHistoryController],
        providers: [view_history_service_1.ViewHistoryService],
        exports: [view_history_service_1.ViewHistoryService],
    })
], ViewHistoryModule);
//# sourceMappingURL=view-history.module.js.map