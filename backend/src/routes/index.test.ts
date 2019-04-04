import * as index from "./index"

describe("Routes", () => {
  describe("getRoutes", () => {
    it("should have an index", () => {
      const result = index.getRoutes()
      const indexRoute = result.find(val => val.path === "/")
      expect(indexRoute).toBeDefined()
    })

    it("should have registration", () => {
      const result = index.getRoutes()
      const indexRoute = result.find(val => val.path === "/register")
      expect(indexRoute).toBeDefined()
    })

    it("should have login", () => {
      const result = index.getRoutes()
      const indexRoute = result.find(val => val.path === "/login")
      expect(indexRoute).toBeDefined()
    })
  })
})
