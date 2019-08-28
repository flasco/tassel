class ViewPagerDataSource {
  constructor(params) {
    this._getPageData = params.getPageData || defaultGetPageData;
    this._pageHasChanged = params.pageHasChanged;

    this.pageIdentities = [];
  }

  cloneWithPages(dataBlob, pageIdentities) {
    var newSource = new ViewPagerDataSource({
      getPageData: this._getPageData,
      pageHasChanged: this._pageHasChanged
    });

    newSource._dataBlob = dataBlob;

    if (pageIdentities) {
      newSource.pageIdentities = pageIdentities;
    } else {
      newSource.pageIdentities = Object.keys(dataBlob);
    }

    newSource._cachedPageCount = newSource.pageIdentities.length;
    newSource._calculateDirtyPages(this._dataBlob, this.pageIdentities);
    return newSource;
  }

  getPageCount() {
    return this._cachedPageCount;
  }

  /**
   * Returns if the row is dirtied and needs to be rerendered
   */
  pageShouldUpdate(pageIndex) {
    var needsUpdate = this._dirtyPages[pageIndex];
    //    warning(needsUpdate !== undefined,
    //  'missing dirtyBit for section, page: ' + pageIndex);
    return needsUpdate;
  }

  /**
   * Gets the data required to render the page
   */
  getPageData(pageIndex) {
    if (!this.getPageData) {
      return null;
    }
    var pageID = this.pageIdentities[pageIndex];
    //    warning(pageID !== undefined,
    //      'renderPage called on invalid section: ' + pageID);
    return this._getPageData(this._dataBlob, pageID);
  }

  /**
   * Private members and methods.
   */

  _calculateDirtyPages(prevDataBlob, prevPageIDs) {
    // construct a hashmap of the existing (old) id arrays
    var prevPagesHash = keyedDictionaryFromArray(prevPageIDs);
    this._dirtyPages = [];

    var dirty;
    for (var sIndex = 0; sIndex < this.pageIdentities.length; sIndex++) {
      var pageID = this.pageIdentities[sIndex];
      dirty = !prevPagesHash[pageID];
      var pageHasChanged = this._pageHasChanged;
      if (!dirty && pageHasChanged) {
        dirty = pageHasChanged(
          this._getPageData(prevDataBlob, pageID),
          this._getPageData(this._dataBlob, pageID)
        );
      }
      this._dirtyPages.push(!!dirty);
    }
  }
}

function defaultGetPageData(dataBlob, pageID) {
  return dataBlob[pageID];
}

function keyedDictionaryFromArray(arr) {
  if (arr.length === 0) {
    return {};
  }
  var result = {};
  for (var ii = 0; ii < arr.length; ii++) {
    var key = arr[ii];
    result[key] = true;
  }
  return result;
}

export default ViewPagerDataSource;
