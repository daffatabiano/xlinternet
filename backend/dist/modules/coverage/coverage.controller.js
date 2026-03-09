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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coverage_service_1 = require("./coverage.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let CoverageController = class CoverageController {
    constructor(service) {
        this.service = service;
    }
    check(body) {
        return this.service.check(body.address, body.city, body.postalCode);
    }
    getCities() {
        return this.service.getCities();
    }
    addAreas(providerId, body) {
        return this.service.addCoverageArea(providerId, body.areas);
    }
    removeArea(id) {
        return this.service.removeCoverageArea(id);
    }
};
exports.CoverageController = CoverageController;
__decorate([
    (0, common_1.Post)('check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check provider coverage by location' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoverageController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available cities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoverageController.prototype, "getCities", null);
__decorate([
    (0, common_1.Post)('areas/:providerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add coverage areas for a provider (admin)' }),
    __param(0, (0, common_1.Param)('providerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CoverageController.prototype, "addAreas", null);
__decorate([
    (0, common_1.Delete)('areas/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a coverage area (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoverageController.prototype, "removeArea", null);
exports.CoverageController = CoverageController = __decorate([
    (0, swagger_1.ApiTags)('coverage'),
    (0, common_1.Controller)('coverage'),
    __metadata("design:paramtypes", [coverage_service_1.CoverageService])
], CoverageController);
//# sourceMappingURL=coverage.controller.js.map