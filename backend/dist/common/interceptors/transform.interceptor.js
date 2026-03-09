"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, operators_1.map)((payload) => {
            // If payload already has { data, meta } shape (paginated), spread it
            if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload && 'meta' in payload) {
                return {
                    success: true,
                    data: payload.data,
                    meta: payload.meta,
                    message: payload.message ?? 'OK',
                    timestamp: new Date().toISOString(),
                };
            }
            // Wrap arrays and other payloads
            return {
                success: true,
                data: payload,
                message: 'OK',
                timestamp: new Date().toISOString(),
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map