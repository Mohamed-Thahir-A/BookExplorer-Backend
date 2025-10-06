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
exports.ProductDetail = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductDetail = class ProductDetail {
};
exports.ProductDetail = ProductDetail;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ProductDetail.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => product_entity_1.Product, product => product.detail),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductDetail.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductDetail.prototype, "isbn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        default: 'No description available'
    }),
    __metadata("design:type", String)
], ProductDetail.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProductDetail.prototype, "specs", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ProductDetail.prototype, "ratings_avg", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductDetail.prototype, "reviews_count", void 0);
exports.ProductDetail = ProductDetail = __decorate([
    (0, typeorm_1.Entity)('product_details')
], ProductDetail);
//# sourceMappingURL=product-detail.entity.js.map