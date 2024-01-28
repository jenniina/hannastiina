import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/useAppDispatch'
import Select, { SelectOption } from './Select'
import { fetchServices } from '../reducers/serviceReducer'
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../reducers/categoryReducer'
import { fetchOrderBy } from '../reducers/orderByReducer'
import { useState, useEffect, useCallback } from 'react'
import { IService, IReducers, IClosestItem, ICategory, IUser } from '../types'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { notify } from '../reducers/notificationReducer'

interface Props {
  user?: IUser
}

const CategoryEdit = ({ user }: Props) => {
  const dispatch = useAppDispatch()
  const { services } = useSelector((state: IReducers) => state.services)
  const { categories } = useSelector((state: IReducers) => state.categories)

  const {
    listItemsByCategory,
    orderedCategories,
    isDragging,
    handleUpdateCategoryOrder,
    handleDragging,
  } = useDragAndDrop(services as IService[])

  const cat = categories[0]
  const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
  const rest = cat?.kategoria.slice(1) ?? ''
  const kategoria = firstLetter + rest
  const [category_, setCategory] = useState<SelectOption>({
    value: categories[0]?.id as number,
    label: kategoria,
  })

  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')
  const [categoryObject, setCategoryObject] = useState<ICategory>(
    categories?.[0] as ICategory
  )

  useEffect(() => {
    dispatch(fetchCategories()).catch((error) => console.error(error))
    dispatch(fetchOrderBy())
      .then(() => dispatch(fetchServices()))
      .catch((error) => console.error(error))
  }, [dispatch])

  const removeCategory = useCallback(
    async (categoryId: number) => {
      // Find the category name in the categories array
      const category = categories.find((cat) => cat?.id === categoryId)
      const categoryName = category?.kategoria ?? ''

      // Get the services for this category
      const services = listItemsByCategory[categoryName]

      if (services && services.length === 0) {
        // If there are no services associated with the category, delete the category
        if (
          window.confirm(
            'Haluatko varmasti poistaa kategorian? Poistoa ei voi peruuttaa.'
          )
        )
          dispatch(deleteCategory(categoryId))
            .then(() => dispatch(fetchCategories()))
            .then(() => setCategory(options[0]))
            .then(() => dispatch(notify(`Kategoria poistettu onnistuneesti`, false, 4)))
            .catch((error) => console.error(error))
      } else {
        // If there are services associated with the category, show an error message
        dispatch(
          notify('Kategoriaa ei voi poistaa, koska siihen liittyy palveluita.', true, 8)
        )
      }
    },
    [dispatch, categories, listItemsByCategory]
  )

  const mapCategoriesToOptions = useCallback(
    (categories: ICategory[]) => {
      return categories?.map((category) => {
        const cat = categories?.find((c) => c?.id === category?.id)
        const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
        const rest = cat?.kategoria.slice(1) ?? ''
        const kategoria = firstLetter + rest
        return {
          value: category?.id,
          label: kategoria,
        }
      }) as SelectOption[]
    },
    [categories]
  )

  const options = mapCategoriesToOptions(categories)

  const mapEmptyCategoriesToOptions = useCallback(
    (categories: ICategory[]) => {
      return categories
        ?.filter((category) => {
          // Find the category name in the categories array
          const categoryName = category.kategoria

          // Get the services for this category
          const services = listItemsByCategory[categoryName]

          // Return true if there are no services associated with the category
          return services && services.length === 0
        })
        .map((category) => {
          const firstLetter = category.kategoria.charAt(0).toUpperCase()
          const rest = category.kategoria.slice(1)
          const kategoria = firstLetter + rest
          return {
            value: category?.id,
            label: kategoria,
          }
        }) as SelectOption[]
    },
    [listItemsByCategory]
  )

  const emptyOptions = mapEmptyCategoriesToOptions(categories)

  useEffect(() => {
    setTimeout(() => {
      // Set z-index of select containers so that they do not open behind the next select container
      const selectContainers = document.querySelectorAll(
        '.select-container'
      ) as NodeListOf<HTMLDivElement>
      const totalContainers = selectContainers?.length + 2

      selectContainers?.forEach((container, index) => {
        const zIndex = totalContainers - index
        container.style.zIndex = `${zIndex}`
      })
    }, 500)
  }, [categories, listItemsByCategory])

  return (
    <div className='edit'>
      <section className='card'>
        <h2 id='kategoriat'>Kategoriat</h2>
        <h3>Kategorioiden järjestys</h3>
        <p>
          Vedä ja pudota kategoriat haluamaasi järjestykseen. Uusi järjestys tallentuu
          automaattisesti.
        </p>
        <ol
          className={`kategoriajarjestys`}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDrop={(e) => {
            e.preventDefault()
            const draggedId = e.dataTransfer.getData('application/my-app')
            // Find the closest item to the drop position
            const closestItem = Array.from(
              e.currentTarget.querySelectorAll('.kategoriajarjestys > li')
            )?.reduce<IClosestItem>(
              (closest, child) => {
                const box = child.getBoundingClientRect()
                const offset = Math.abs(box.top - e.clientY)
                if (offset < closest.offset) {
                  return { offset, element: child as HTMLElement }
                } else {
                  return closest
                }
              },
              { offset: Number.POSITIVE_INFINITY }
            )
            // Use the index of the closest item as the new target index
            const newTargetIndex = Array.from(
              e.currentTarget.querySelectorAll('.kategoriajarjestys > li')
            ).indexOf(closestItem.element as HTMLElement)

            handleUpdateCategoryOrder(Number(draggedId), newTargetIndex)
          }}
        >
          {orderedCategories?.map((category) => {
            const firstLetter = category?.kategoria?.charAt(0)?.toUpperCase() ?? ''
            const rest = category?.kategoria?.slice(1) ?? category?.kategoria
            const kategoria = `${firstLetter}${rest}`
            return (
              <li
                className={`${isDragging ? 'dragging' : ''}`}
                key={category?.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/my-app',
                    category?.id?.toString() as string
                  )
                  e.dataTransfer.effectAllowed = 'move'
                  handleDragging(true)
                }}
                onDragEnd={() => handleDragging(false)}
              >
                {kategoria}
              </li>
            )
          })}
        </ol>
        <h3>Lisää uusi kategoria</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (newName === '') {
              dispatch(notify(`Kategorian nimi ei voi olla tyhjä`, true, 4))
              return
            } else if (
              categories.some(
                (category) => category.kategoria?.toLowerCase() === newName?.toLowerCase()
              )
            ) {
              dispatch(notify(`Kategoria ${newName} on jo olemassa`, true, 4))
              return
            } else {
              dispatch(
                addCategory({
                  kategoria: newName?.toLowerCase(),
                  viimeisinMuokkaus: user?.id as number,
                })
              )
                .then(() => {
                  dispatch(fetchCategories())
                  setNewName('')
                })
                .then(() => dispatch(notify(`Kategoria lisätty onnistuneesti`, false, 4)))
                .catch((error) => {
                  console.error(error)
                  dispatch(
                    notify(
                      `Kategorian lisäämisessä tapahtui virhe! ${error.message}`,
                      true,
                      4
                    )
                  )
                })
            }
          }}
        >
          <div className='input-wrap'>
            <label htmlFor='category-new'>Kategorian nimi: </label>
            <span className='input'>
              <input
                id='category-new'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </span>
          </div>
          <button type='submit'>Lisää kategoria</button>
        </form>

        <h3>Muokkaa kategorian nimeä</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            dispatch(
              updateCategory({
                id: categoryObject?.id as number,
                category: categoryObject as ICategory,
              })
            )
              .then(() => dispatch(fetchCategories()))
              .then(() => {
                setCategory(options[0])
                setName('')
              })
              .then(() =>
                dispatch(notify(`Kategorian nimi muutettu onnistuneesti`, false, 4))
              )
              .catch((error) => {
                console.error(error)
                dispatch(
                  notify(`Kategorian nimen muuttamisessa tapahtui virhe!`, true, 4)
                )
              })
          }}
        >
          {categories?.length > 0 && (
            <div>
              <Select
                className='category-select'
                id='category-edit'
                value={category_}
                onChange={(o) => {
                  setCategory(o as SelectOption)
                  setName(o?.label?.toLowerCase() as string)
                  setCategoryObject({
                    ...(categories?.find((c) => c?.id === o?.value) as ICategory),
                    viimeisinMuokkaus: user?.id as number,
                  })
                }}
                options={options}
                instructions='Valitse kategoria'
                selectAnOption='Valitse kategoria'
              />

              <div className='input-wrap'>
                <label htmlFor='category-edit'>Kategorian nimi: </label>
                <span className='input'>
                  <input
                    id='category-edit'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setCategoryObject({
                        ...categoryObject,
                        kategoria: e.target.value?.toLowerCase() as string,
                        viimeisinMuokkaus: user?.id as number,
                      })
                    }}
                  />
                </span>
              </div>
              <button type='submit'>Tallenna</button>
            </div>
          )}
        </form>

        <h3>Poista tyhjä kategoria</h3>
        <p>
          Jos kategoriaan ei ole liitetty yhtään palvelua, voit poistaa sen. Jos
          kategoriaan on liitetty palveluita, poista ensin kaikki palvelut kategoriasta.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            removeCategory(categoryObject?.id as number)
          }}
        >
          {categories?.length > 0 && emptyOptions.length > 0 ? (
            <div>
              <Select
                className='category-select'
                id='category-empty'
                value={category_}
                onChange={(o) => {
                  setCategory(o as SelectOption)
                  setCategoryObject({
                    ...(categories?.find((c) => c?.id === o?.value) as ICategory),
                    viimeisinMuokkaus: user?.id as number,
                  })
                }}
                options={emptyOptions}
                instructions='Valitse kategoria'
                selectAnOption='Valitse kategoria'
              />
              <button type='submit' className='danger'>
                Poista kategoria
              </button>
            </div>
          ) : (
            <p>(Ei tyhjiä kategorioita)</p>
          )}
        </form>
      </section>
    </div>
  )
}

export default CategoryEdit
