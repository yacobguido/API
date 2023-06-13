
class Pagination {
    constructor(data, itemsPerPage) {
      this.data = data;
      this.itemsPerPage = itemsPerPage;
      this.currentPage = 1;
    }
  
    getCurrentPageData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.data.slice(startIndex, endIndex);
    }
  
    getTotalPages() {
      return Math.ceil(this.data.length / this.itemsPerPage);
    }
  
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
        this.currentPage = pageNumber;
        return this.getCurrentPageData();
      }
      return [];
    }
  
    nextPage() {
      return this.goToPage(this.currentPage + 1);
    }
  
    previousPage() {
      return this.goToPage(this.currentPage - 1);
    }
  }
  

  