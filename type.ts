export type TupleToUnion<T extends any[]> = T extends any[] ? T[number] : never
export type DeepOptional<T> = {
    [P in keyof T]?: T[P] extends ((...arg: any) => any) ? T[P] : DeepOptional<T[P]>
}
// 1：左下方，2：底部中心，3：右下方，5：左上方，6：顶部中央，7：右上方，9：左中，10：中间中，11：右中
export type TextPosition = 1 | 2 | 3 | 5 | 6 | 7 | 9 | 10 | 11

export type ObjKeyUnion<T> = TupleToUnion<Keys<T>>
export type Keys<T> = [keyof T]