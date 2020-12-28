// keep properties in alphabetical order!

module.exports = {
    // Whether to use async updates.
    async: true,

    // Max circular updates allowed in a batcher flush cycle.
    _maxUpdateCount: 100,

    // List of asset types that a component can own.
    _assetTypes: ['component', 'directive', 'filter'],
};
