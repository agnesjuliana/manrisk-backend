# CRUD Pattern Analysis - Asset vs SOA

## Pattern CRUD yang Ada di Asset Module

### 1. **Layer Structure**
```
Controller → Service → Repository → Database
```

### 2. **Controller Pattern** (asset.controller.ts)
- **Import**: Mengimport `CustomResponse` dari middleware
- **Error Handling**: Menggunakan `try-catch` dengan `next(error)` untuk error propagation
- **Return Statements**: Menggunakan `return response.status()` (explicit return)
- **Error Response**: Mengecek NOT_FOUND (404) dengan explicit response, bukan throw error
- **Async Pattern**: Semua method adalah `async`

```typescript
// ✅ Pattern di Asset untuk NOT_FOUND
if (!result) {
  const customResponse = new CustomResponse(
    StatusCodes.NOT_FOUND,
    'Asset tidak ditemukan',
    null,
  );
  return response.status(StatusCodes.NOT_FOUND).json(customResponse.toJSON());
}
```

### 3. **Service Pattern** (asset.service.ts)
- **Validation**: Service melakukan `validatePaginationParameters()` untuk validasi
- **Delegation**: Service hanya mendelegasikan ke repository, tidak ada business logic complex
- **Return Type**: Mereturn tipe yang sesuai dengan repository return
- **Parameter Passing**: Pass through parameters dengan sedikit preprocessing

```typescript
// ✅ Pattern di Asset - Validasi di Service
const { page: validPage, perPage: validPerPage } = validatePaginationParameters(page, perPage);
```

### 4. **Repository Pattern** (asset.repository.ts)
- **Select Object**: Menggunakan object `select` yang didefine sekali, reusable di multiple queries
- **Pagination**: Menggunakan helper `calculateSkip()` dan `Promise.all()` untuk parallel queries
- **Response Structure**: Consistent dengan model yang didefinisikan
- **Where Conditions**: Complex conditions dibangun secara dynamic berdasarkan parameter

```typescript
// ✅ Pattern di Asset - Reusable select object
const selectFields = {
  id: true,
  organizationId: true,
  // ... fields
  owner: {
    select: { /* nested select */ }
  }
};

// Used in multiple places
const data = await prisma.asset.findMany({
  where: whereCondition,
  select: selectFields,
  orderBy: { createdAt: 'desc' },
  skip,
  take: perPage,
});
```

### 5. **Model Pattern** (asset.model.ts)
- **Input Models**: `CreateAssetRequest`, `UpdateAssetRequest` terpisah
- **Response Model**: `AssetResponse` yang extend dari input models
- **Nested Objects**: Sub-object types (e.g., `AssetTypeData`, `AssetOwnerData`)
- **Type Safety**: Setiap field memiliki tipe yang jelas

---

## Current State of SOA Module

### ✅ What's Good (Sesuai Pattern)
1. **Layer Structure**: Controller → Service → Repository (✅)
2. **Error Handling**: Try-catch dengan `next(error)` (✅)
3. **Service Delegation**: Service hanya pass-through ke repository (✅)
4. **Model Interfaces**: Terpisah Create/Update/Response (✅)

### ⚠️ Deviations from Pattern

1. **Controller - Error Handling**
   ```typescript
   // ❌ Current: Throw error di controller
   if (!result) {
     throw new Error('SOA tidak ditemukan');
   }
   
   // ✅ Should be: Return 404 response
   if (!result) {
     const customResponse = new CustomResponse(
       StatusCodes.NOT_FOUND,
       'SOA tidak ditemukan',
       null,
     );
     return response.status(StatusCodes.NOT_FOUND).json(customResponse.toJSON());
   }
   ```

2. **Controller - Return Statements**
   ```typescript
   // ❌ Current: Missing return statements
   response.status(StatusCodes.CREATED).json(customResponse.toJSON());
   
   // ✅ Should be: Explicit return
   return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
   ```

3. **Repository - Select Object**
   ```typescript
   // ❌ Current: soaDetailSelect defined once but not used in getSOAs
   // getSOAs tidak menggunakan select helper yang sama
   
   // ✅ Should be: Reuse select object di semua query
   ```

4. **Service - No Validation**
   ```typescript
   // ❌ Current: Service tidak ada validation
   export async function getSOAsService(...): Promise<SOAListItemResponse[]> {
     return getSOAs(...); // Direct pass-through tanpa validasi
   }
   
   // ✅ Should add: Validation jika diperlukan
   ```

5. **getSOAById - Missing statusTarget**
   ```typescript
   // ❌ Current: getSOAById returns SOADetailResponse tanpa statusTarget
   // Hanya getSOAs yang punya statusTarget calculation
   
   // ✅ Should be: getSOAById juga include statusTarget computation
   ```

---

## Recommended Improvements for SOA Module

### 1. Fix Controller - getSOAById Error Handling
```typescript
async getSOAById(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const user = request.user as { id: string; organizationId: string };
    const { id } = request.params;

    const result = await getSOAByIdService(user.organizationId, id);

    if (!result) {
      const customResponse = new CustomResponse(
        StatusCodes.NOT_FOUND,
        'SOA tidak ditemukan',
        null,
      );
      return response.status(StatusCodes.NOT_FOUND).json(customResponse.toJSON());
    }

    const customResponse = new CustomResponse(
      StatusCodes.OK,
      'Detail SOA berhasil diambil',
      result,
    );

    return response.status(StatusCodes.OK).json(customResponse.toJSON());
  } catch (error: any) {
    return next(error);
  }
}
```

### 2. Fix All Controllers - Add Return Statements
```typescript
// Add 'return' before all response.status() calls
return response.status(StatusCodes.CREATED).json(customResponse.toJSON());
```

### 3. Create Dedicated Select Object in Repository
```typescript
const soaDetailSelect = { /* ... */ };

// Use ini di getSOAById AND getSOAs untuk consistency
```

### 4. Add statusTarget to getSOAById Response
```typescript
// getSOAById juga perlu compute statusTarget seperti di getSOAs
// Buat helper function untuk reusable calculation
```

### 5. Create Helper Function untuk statusTarget Calculation
```typescript
function computeStatusTarget(targetDate: Date | null | undefined, implementationStatus: string | null | undefined): 'ON_TRACK' | 'OVERDUE' {
  return (
    targetDate &&
    new Date(targetDate) < new Date() &&
    implementationStatus !== 'DIIMPLEMENTASIKAN'
      ? 'OVERDUE'
      : 'ON_TRACK'
  );
}
```

---

## Summary

**Pattern CRUD yang Ada:**
- **Controller**: Explicit return statements, proper status codes, error handling dengan response objects
- **Service**: Thin layer, mostly pass-through dengan optional validation
- **Repository**: Reusable select objects, parallel queries, dynamic where conditions
- **Models**: Type-safe interfaces, separated by operation type

**Action Items untuk SOA:**
1. ✅ Fix controller error handling (NOT_FOUND response, not throw)
2. ✅ Add return statements di semua controller methods
3. ✅ Reuse select object di repository
4. ✅ Add statusTarget computation ke getSOAById juga
5. ✅ Create helper function untuk statusTarget calculation
