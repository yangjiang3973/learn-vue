// export const enum ShapeFlags {
//     ELEMENT = 1,
//     FUNCTIONAL_COMPONENT = 1 << 1,
//     STATEFUL_COMPONENT = 1 << 2,
//     TEXT_CHILDREN = 1 << 3,
//     ARRAY_CHILDREN = 1 << 4,
//     SLOTS_CHILDREN = 1 << 5,
//     TELEPORT = 1 << 6,
//     SUSPENSE = 1 << 7,
//     COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
//     COMPONENT_KEPT_ALIVE = 1 << 9,
//     COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
// }

export const enum ShapeFlags {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 2,
    STATEFUL_COMPONENT = 3,
    TEXT_CHILDREN = 4,
    ARRAY_CHILDREN = 5,
    SLOTS_CHILDREN = 6,
    TELEPORT = 7,
    SUSPENSE = 8,
    COMPONENT_SHOULD_KEEP_ALIVE = 9,
    COMPONENT_KEPT_ALIVE = 10,
    COMPONENT = 11,
}
