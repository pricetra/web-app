import { gql } from '@apollo/client';

export const GET_ALL_COUNTRIES_QUERY = gql`
  query GetAllCountries {
    getAllCountries {
      code
      name
      administrativeDivisions {
        name
        cities
      }
      currency {
        currencyCode
        name
        symbol
        symbolNative
        decimals
        numToBasic
      }
      callingCode
      language
    }
  }
`;

export const LOGIN_INTERNAL_QUERY = gql`
  query LoginInternal(
    $email: String!
    $password: String!
    $ipAddress: String
    $device: AuthDeviceType
  ) {
    login(email: $email, password: $password, ipAddress: $ipAddress, device: $device) {
      token
      user {
        id
        name
        email
        avatar
        createdAt
        updatedAt
        active
        authDevice
        authPlatform
        authStateId
        expoPushToken
        role
        addressId
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          street
          city
          administrativeDivision
          countryCode
          country
          zipCode
        }
      }
    }
  }
`;

export const GOOGLE_OAUTH_QUERY = gql`
  query GoogleOAuth($accessToken: String!, $ipAddress: String, $device: AuthDeviceType) {
    googleOAuth(accessToken: $accessToken, ipAddress: $ipAddress, device: $device) {
      token
      user {
        id
        name
        email
        avatar
        createdAt
        updatedAt
        active
        authDevice
        authPlatform
        authStateId
        expoPushToken
        role
        addressId
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          street
          city
          administrativeDivision
          countryCode
          country
          zipCode
        }
      }
      isNewUser
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
      createdAt
      updatedAt
      active
      authDevice
      authPlatform
      authStateId
      expoPushToken
      role
      addressId
      address {
        id
        latitude
        longitude
        mapsLink
        fullAddress
        street
        city
        administrativeDivision
        countryCode
        country
        zipCode
      }
      birthDate
      phoneNumber
      bio
    }
  }
`;

export const ALL_PRODUCTS_QUERY = gql(`
  query AllProducts($paginator: PaginatorInput!, $search: ProductSearch) {
    allProducts(paginator: $paginator, search: $search) {
      products {
        id
        name
        image
        description
        brand
        code
        model
        categoryId
        category {
          id
          name
          expandedPathname
          path
        }
        stock {
          id
          productId
          storeId
          store {
            id
            name
            logo
          }
          branchId
          branch {
            id
            name
            address {
              id
              latitude
              longitude
              mapsLink
              fullAddress
              street
              city
              administrativeDivision
              countryCode
              country
              zipCode
              distance
            }
          }
          latestPriceId
          latestPrice {
            id
            productId
            branchId
            storeId
            amount
            currencyCode
            createdAt
            sale
            originalPrice
            condition
            expiresAt
            unitType
            createdBy {
              id
              name
              avatar
            }
          }
          createdBy {
            id
            name
            avatar
          }
          updatedBy {
            id
            name
            avatar
          }
        }
        weightValue
        weightType
        quantityValue
        quantityType
        createdAt
        updatedAt
        views
      }
      paginator {
        next
        page
        prev
        limit
        total
        numPages
      }
    }
  }
`);

export const PRODUCT_BY_ID_QUERY = gql(`
  query Product($productId: ID!, $viewerTrail: ViewerTrailInput) {
    product(id: $productId, viewerTrail: $viewerTrail) {
      id
      name
      image
      description
      brand
      code
      model
      categoryId
      category {
        id
        name
        categoryAlias
        expandedPathname
        path
      }
      weightValue
      weightType
      quantityValue
      quantityType
      createdAt
      updatedAt
      views
      productList {
        id
        listId
        userId
        productId
        type
        stockId
        createdAt
      }
    }
  }
`);

export const GET_STOCK_BY_ID = gql(`
  query Stock($stockId: ID!) {
    stock(stockId: $stockId) {
      id
      productId
      storeId
      store {
        id
        name
        logo
      }
      branchId
      branch {
        id
        name
        address {
          id
          latitude
          longitude
          mapsLink
          fullAddress
          street
          city
          administrativeDivision
          countryCode
          country
          zipCode
          distance
        }
      }
      latestPriceId
      latestPrice {
        id
        productId
        branchId
        storeId
        amount
        currencyCode
        sale
        originalPrice
        condition
        expiresAt
        createdAt
        unitType
      }
      createdAt
      updatedAt
      createdBy {
        id
        name
        avatar
      }
      updatedBy {
        id
        name
        avatar
      }
    }
  }
`);

export const GET_PRODUCT_STOCKS_QUERY = gql(`
  query GetProductStocks($paginator: PaginatorInput!, $productId: ID!, $location: LocationInput) {
    getProductStocks(paginator: $paginator, productId: $productId, location: $location) {
      stocks {
        id
        productId
        storeId
        store {
          id
          name
          logo
        }
        branchId
        branch {
          id
          name
          address {
            id
            latitude
            longitude
            mapsLink
            fullAddress
            street
            city
            administrativeDivision
            countryCode
            country
            zipCode
            distance
          }
        }
        latestPriceId
        latestPrice {
          id
          productId
          branchId
          storeId
          amount
          currencyCode
          sale
          originalPrice
          condition
          expiresAt
          unitType
        }
        createdAt
        updatedAt
        createdBy {
          id
          name
          avatar
        }
        updatedBy {
          id
          name
          avatar
        }
      }
      paginator {
        next
        page
        prev
        limit
        total
        numPages
      }
    }
  }
`);

export const ALL_STORES_QUERY = gql(`
  query AllStores($paginator: PaginatorInput!, $search: String) {
    allStores(paginator: $paginator, search: $search) {
      stores {
        id
        name
        logo
        website
      }
      paginator {
        next
        page
        prev
        limit
        total
        numPages
      }
    }
  }
`);

export const BRANCHES_WITH_PRODUCTS_QUERY = gql(`
  query BranchesWithProducts($paginator: PaginatorInput!, $productLimit: Int!, $filters: ProductSearch) {
    branchesWithProducts(
      paginator: $paginator
      productLimit: $productLimit
      filters: $filters
    ) {
      branches {
        id
        name
        storeId
        store {
          id
          name
          logo
        }
        address {
          id
          distance
          latitude
          longitude
          mapsLink
          fullAddress
          street
          city
          administrativeDivision
          countryCode
          country
          zipCode
        }
        products {
          id
          name
          image
          description
          brand
          code
          model
          categoryId
          category {
            id
            name
            expandedPathname
            path
          }
          stock {
            id
            productId
            storeId
            branchId
            latestPriceId
            latestPrice {
              id
              productId
              branchId
              storeId
              amount
              currencyCode
              createdAt
              sale
              originalPrice
              condition
              expiresAt
              unitType
            }
            createdBy {
              id
              name
              avatar
            }
            updatedBy {
              id
              name
              avatar
            }
          }
          weightValue
          weightType
          quantityValue
          quantityType
          createdAt
          updatedAt
          views
        }
      }
      paginator {
        next
        page
        prev
        limit
        total
        numPages
      }
    }
  }
`);

export const IP_TO_ADDRESS_QUERY = gql(`
  query IpToAddress($ipAddress: String!) {
    ipToAddress(ipAddress: $ipAddress) {
      id
      latitude
      longitude
      mapsLink
      fullAddress
      street
      city
      administrativeDivision
      zipCode
      countryCode
      country
    }
  }
`);

export const POST_AUTH_USER_DATA_QUERIES = gql(`
  query PostAuthUserData($listType: ListType) {
    getAllLists(listType: $listType) {
      id
      name
      type
      userId
      createdAt
      productList {
        id
        listId
        productId
        stockId
        createdAt
      }
      branchList {
        id
        listId
        branchId
        createdAt
      }
    }

    groceryLists {
      id
      name
      default
      createdAt
    }
  }
`);

export const PRODUCT_SUMMARY_QUERY = gql(`
  query ProductSummary($productId: ID!) {
    productSummary(id: $productId) {
      id
      name
      image
      description
      brand
      code
    }
  }
`);

export const GET_PRODUCT_NUTRITION_DATA_QUERY = gql(`
  query GetProductNutritionData($productId: ID!) {
    getProductNutritionData(productId: $productId) {
      productId
      servingSize
      servingSizeUnit
      servingSizeValue
      ingredientText
      ingredientList
      nutriments {
        salt
        salt100g
        saltValue
        saltServing
        saltUnit
        sugars
        sugars100g
        sugarsValue
        sugarsServing
        sugarsUnit
        iron
        iron100g
        ironValue
        ironServing
        ironUnit
        ironLabel
        calcium
        calcium100g
        calciumValue
        calciumServing
        calciumUnit
        calciumLabel
        cholesterol100g
        saturatedFat
        saturatedFat100g
        saturatedFatValue
        saturatedFatServing
        saturatedFatUnit
        fat
        fat100g
        fatValue
        fatServing
        fatUnit
        transFat
        transFat100g
        transFatValue
        transFatServing
        transFatUnit
        transFatLabel
        vitaminA
        vitaminA100g
        vitaminAValue
        vitaminAServing
        vitaminAUnit
        vitaminALabel
        vitaminC
        vitaminC100g
        vitaminCValue
        vitaminCServing
        vitaminCUnit
        vitaminCLabel
        proteins
        proteins100g
        proteinsValue
        proteinsServing
        proteinsUnit
        fiber
        fiber100g
        fiberValue
        fiberServing
        fiberUnit
        carbohydrates
        carbohydrates100g
        carbohydratesValue
        carbohydratesServing
        carbohydratesUnit
        alcohol
        alcohol100g
        alcoholValue
        alcoholServing
        alcoholUnit
        sodium
        sodium100g
        sodiumValue
        sodiumServing
        sodiumUnit
        potassium100g
        polyunsaturatedFat100g
        monounsaturatedFat100g
        novaGroup
        novaGroup100g
        novaGroupServing
        energy
        energy100g
        energyValue
        energyServing
        energyUnit
        energyKcal
        energyKcal100g
        energyKcalValue
        energyKcalServing
        energyKcalUnit
        nutritionScoreFr
        nutritionScoreFr100g
        nutritionScoreFrServing
        nutritionScoreUk
        nutritionScoreUk100g
        nutritionScoreUkServing
      }
      vegan
      vegetarian
      glutenFree
      lactoseFree
      halal
      kosher
      createdAt
      updatedAt
    }
  }
`);
