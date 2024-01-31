import { useState, useCallback, useEffect } from 'react'
import { ICategory, ICategoryState, IReducers, IService } from '../types'
import { fetchCategories, updateCategoryOrder } from '../reducers/categoryReducer'
import { updateOrderBy } from '../reducers/orderByReducer'
import { useSelector } from 'react-redux'
import { useAppDispatch } from './useAppDispatch'
import { notify } from '../reducers/notificationReducer'

export const useDragAndDrop = (initialState: IService[]) => {
  const dispatch = useAppDispatch()
  const { categories } = useSelector(
    (state: IReducers) => state.categories
  ) as ICategoryState

  interface CategoryItems {
    [key: string]: IService[]
  }

  useEffect(() => {
    dispatch(fetchCategories()).catch((error) => console.error(error))
  }, [dispatch])

  const [isDragging, setIsDragging] = useState(false)
  const [listItemsByCategory, setListItemsByCategory] = useState<CategoryItems>({})

  const [orderedCategories, setOrderedCategories] = useState<ICategory[]>(categories)

  useEffect(() => {
    setOrderedCategories(categories)
  }, [categories])

  const handleUpdateCategoryOrder = useCallback(
    async (dragId: number, hoverId: number) => {
      const draggedCategoryIndex = orderedCategories.findIndex(
        (category) => category.id === dragId
      )
      const draggedCategory = orderedCategories.find((category) => category.id === dragId)
      if (!draggedCategory) {
        console.error(`Category with id ${dragId} not found`)
        return
      }
      const dragCategory = orderedCategories[draggedCategoryIndex]
      const newCategories = [...orderedCategories]
      newCategories.splice(draggedCategoryIndex, 1)
      newCategories.splice(hoverId, 0, dragCategory)

      // Dispatch the updateCategoryOrder action with the new order of category IDs
      await dispatch(
        updateCategoryOrder(newCategories.map((category) => category.id as number))
      )
        .then(() => setOrderedCategories(newCategories))
        .then(() => dispatch(fetchCategories()))
        .catch((error) => console.error(error))
    },
    [orderedCategories, dispatch]
  )

  // useEffect(() => {
  //   if (orderedCategories?.length > 0)
  //     dispatch(
  //       updateCategoryOrder(
  //         orderedCategories.map((category) => category.orderIndex as number)
  //       )
  //     ).catch((error) => console.error(error))
  //   else if (categories?.length > 0)
  //     dispatch(
  //       updateCategoryOrder(categories.map((category) => category.orderIndex as number))
  //     ).catch((error) => console.error(error))
  // }, [dispatch, orderedCategories])

  useEffect(() => {
    const newListItemsByCategory = orderedCategories.reduce(
      (acc: CategoryItems, category) => {
        const itemsInCategory = initialState?.filter(
          (item) => item?.kategoria === category.id
        )
        acc[category.kategoria] = itemsInCategory
        return acc
      },
      {}
    )

    setListItemsByCategory(newListItemsByCategory)
  }, [orderedCategories, initialState])

  const handleUpdate = (id: number, category: string, targetIndex: number) => {
    return new Promise<void>((resolve) => {
      setListItemsByCategory((prevListItemsByCategory) => {
        let card
        let sourceIndex

        // Find the card in the category
        const listItems = prevListItemsByCategory[category]
        sourceIndex = listItems?.findIndex((item) => item?.id === id)
        card = listItems[sourceIndex]

        // If the card was found, update its position
        if (card) {
          // Remove the card from its current position
          const updatedListItems = [...listItems]
          updatedListItems?.splice(sourceIndex, 1)

          // Add the card to the new position
          updatedListItems?.splice(targetIndex, 0, card)

          // Create a copy of listItemsByCategory
          const updatedListItemsByCategory = { ...prevListItemsByCategory }

          // Update the copy
          updatedListItemsByCategory[category] = updatedListItems

          const updated = Object.values(updatedListItemsByCategory)?.flat()

          // Dispatch the updateOrderBy action with the new order

          dispatch(
            updateOrderBy(
              updated?.map((service, index) => ({
                jarjestys: index,
                palveluId: service.id,
              }))
            )
          )
            .then((result) => {
              if (result.type === 'orderBy/updateOrderBy/rejected') {
                if ('payload' in result && result.payload !== undefined) {
                  dispatch(notify(`Tapahtui virhe! ${result.payload}`, true, 8))
                }
                return
              }

              resolve()
            })
            .catch((error) => console.error(error))

          return updatedListItemsByCategory
        }

        resolve()
        return prevListItemsByCategory
      })
    })
  }

  const handleDragging = (dragging: boolean) => setIsDragging(dragging)

  return {
    isDragging,
    listItemsByCategory,
    orderedCategories,
    handleUpdate,
    handleUpdateCategoryOrder,
    handleDragging,
  }
}
