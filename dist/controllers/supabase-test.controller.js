"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseTestController = void 0;
const common_1 = require("@nestjs/common");
const supabase_test_service_1 = require("../services/supabase-test.service");
let SupabaseTestController = class SupabaseTestController {
    constructor(supabaseTestService) {
        this.supabaseTestService = supabaseTestService;
    }
    async testConnection() {
        return this.supabaseTestService.testConnection();
    }
};
exports.SupabaseTestController = SupabaseTestController;
__decorate([
    (0, common_1.Get)('connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseTestController.prototype, "testConnection", null);
exports.SupabaseTestController = SupabaseTestController = __decorate([
    (0, common_1.Controller)('supabase-test'),
    __metadata("design:paramtypes", [supabase_test_service_1.SupabaseTestService])
], SupabaseTestController);
//# sourceMappingURL=supabase-test.controller.js.map