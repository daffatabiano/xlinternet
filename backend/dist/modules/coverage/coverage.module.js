"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverageModule = void 0;
// coverage.module.ts
const common_1 = require("@nestjs/common");
const coverage_controller_1 = require("./coverage.controller");
const coverage_service_1 = require("./coverage.service");
const prisma_module_1 = require("../../config/prisma.module");
let CoverageModule = class CoverageModule {
};
exports.CoverageModule = CoverageModule;
exports.CoverageModule = CoverageModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [coverage_controller_1.CoverageController],
        providers: [coverage_service_1.CoverageService],
    })
], CoverageModule);
//# sourceMappingURL=coverage.module.js.map