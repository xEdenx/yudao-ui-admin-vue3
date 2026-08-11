import { defineStore } from 'pinia'
import { store } from '../index'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')
import { getSimpleDictDataList as getHeadlessBpmDictDataList } from '@/api/bpm/portalAuth'

export interface DictValueType {
  value: any
  label: string
  clorType?: string
  cssClass?: string
}
export interface DictTypeType {
  dictType: string
  dictValue: DictValueType[]
}
export interface DictState {
  dictMap: any
  isSetDict: boolean
}

interface DictDataItem {
  dictType: string
  value: string | number | boolean
  label: string
  colorType?: string
  cssClass?: string
}

const buildDictDataMap = (dictDataList: DictDataItem[]) => {
  const dictDataMap: Recordable = {}
  dictDataList.forEach((dictData) => {
    if (!dictDataMap[dictData.dictType]) {
      dictDataMap[dictData.dictType] = []
    }
    dictDataMap[dictData.dictType].push({
      value: dictData.value,
      label: dictData.label,
      colorType: dictData.colorType,
      cssClass: dictData.cssClass
    })
  })
  return dictDataMap
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: new Map<string, any>(),
    isSetDict: false
  }),
  getters: {
    getDictMap(): Recordable {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap) {
        this.dictMap = dictMap
      }
      return this.dictMap
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    }
  },
  actions: {
    async setDictMap() {
      // 管理端只支持 Headless BPM；固定字典全部由 BPM/Portal 契约提供。
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap) {
        this.dictMap = dictMap
        this.isSetDict = true
      } else {
        const res = await getHeadlessBpmDictDataList()
        if (!res || res.length === 0) {
          return
        }
        // 设置数据
        const dictDataMap = buildDictDataMap(res)
        this.dictMap = dictDataMap
        this.isSetDict = true
        wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
      }
    },
    getDictByType(type: string) {
      if (!this.isSetDict) {
        this.setDictMap()
      }
      return this.dictMap[type]
    },
    async resetDict() {
      wsCache.delete(CACHE_KEY.DICT_CACHE)
      const res = await getHeadlessBpmDictDataList()
      if (!res || res.length === 0) {
        return
      }
      // 设置数据
      const dictDataMap = buildDictDataMap(res)
      this.dictMap = dictDataMap
      this.isSetDict = true
      wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
