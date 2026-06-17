import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponse<T>(
  dataType?: Type<T>,
  options?: { status?: number; description?: string },
) {
  const status = options?.status ?? 200;
  const description = options?.description ?? 'Success';

  const dataSchema = dataType
    ? { $ref: getSchemaPath(dataType) }
    : { type: 'object' as const, nullable: true };

  const decorators = [
    ...(dataType ? [ApiExtraModels(dataType)] : []),
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: dataSchema,
          message: { type: 'string' },
        },
      },
    }),
  ];

  return applyDecorators(...decorators);
}

export function ApiPaginatedResponse<T>(
  dataType: Type<T>,
  options?: { description?: string },
) {
  return applyDecorators(
    ApiExtraModels(dataType),
    ApiResponse({
      status: 200,
      description: options?.description ?? 'Paginated list',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dataType) },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              limit: { type: 'number' },
              total: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    }),
  );
}

export function ApiErrorResponse(
  status: number,
  code: string,
  description: string,
) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: code },
              message: { type: 'string' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
    }),
  );
}
