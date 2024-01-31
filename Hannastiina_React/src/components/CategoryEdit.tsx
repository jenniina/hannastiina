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
import { useState, useEffect, useCallback, FormEvent } from 'react'
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

  const mapCategoriesToOptions = useCallback(
    (categories: ICategory[]) => {
      const options = categories?.map((category) => {
        const cat = categories?.find((c) => c?.id === category?.id)
        const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
        const rest = cat?.kategoria.slice(1) ?? ''
        const kategoria = firstLetter + rest
        return {
          value: category?.id,
          label: kategoria,
        }
      }) as SelectOption[]

      options.unshift({ value: '', label: 'Valitse kategoria' })

      return options
    },
    [categories]
  )
  const options = mapCategoriesToOptions(categories)
  const [category_, setCategory] = useState<SelectOption>(options[0])
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
  const [emptyCategory, setEmptyCategory] = useState<SelectOption>({
    value: emptyOptions[0]?.value as number,
    label: emptyOptions[0]?.label as string,
  })

  useEffect(() => {
    setEmptyCategory(emptyOptions[0])
  }, [listItemsByCategory])

  const [name, setName] = useState('')
  const [newName, setNewName] = useState('')
  const [info, setInfo] = useState(categories?.[0]?.info as string)
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

  const editCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (category_.value === '') {
      dispatch(notify(`Valitse kategoria`, true, 4))
      return
    } else if (
      categories.some(
        (category) => category.kategoria?.toLowerCase() === name?.toLowerCase()
      )
    ) {
      dispatch(notify(`Kategorian nimi on jo ${name}`, true, 4))
      return
    } else if (categoryObject?.kategoria?.trim() === '') {
      dispatch(notify(`Kategorian nimi ei voi olla tyhjä`, true, 4))
      return
    } else {
      await dispatch(
        updateCategory({
          id: categoryObject?.id as number,
          category: categoryObject as ICategory,
        })
      )
        .then((result) => {
          if (result.type === 'categories/updateCategory/rejected') {
            if ('payload' in result && result.payload !== undefined) {
              dispatch(notify(`${result.payload}`, true, 8))
            }
          } else dispatch(notify('Kategoria muutettu', false, 3))
          dispatch(fetchServices())
        })
        .then(() => dispatch(fetchCategories()))
        .then(() => {
          setCategory(options[0])
          setName('')
        })
        .catch((error) => {
          console.error(error)
          dispatch(notify(`Virhe! ${error.response.data.message ?? ''}`, true, 4))
        })
    }
  }

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
            if (newName.trim() === '') {
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
                  info: info,
                  viimeisinMuokkaus: user?.id as number,
                })
              )
                .then((result) => {
                  if (result.type === 'categories/addCategory/rejected') {
                    if ('payload' in result && result.payload !== undefined) {
                      dispatch(notify(`${result.payload}`, true, 8))
                    }
                  } else dispatch(notify('Kategoria lisätty onnistuneesti', false, 3))
                  dispatch(fetchServices())
                })
                .then(() => {
                  dispatch(fetchCategories())
                  setNewName('')
                  setInfo('')
                })
                .catch((error) => {
                  console.error(error)
                  dispatch(notify(`Virhe! ${error.response.data.message ?? ''}`, true, 4))
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
          <div className='input-wrap'>
            <label htmlFor='category-info'>Kategorian tarkenne: </label>
            <span className='input'>
              <input
                id='category-info'
                value={info}
                onChange={(e) => setInfo(e.target.value)}
              />
            </span>
          </div>
          <button type='submit'>Lisää kategoria</button>
        </form>

        <h3>Muokkaa kategoriaa</h3>
        <form
          className='edit-category'
          onSubmit={(e) => {
            editCategory(e)
          }}
        >
          {categories?.length > 0 && (
            <>
              <Select
                className='category-select'
                id='category-edit'
                value={category_}
                onChange={(o) => {
                  setCategory(o as SelectOption)
                  setName(o?.label?.toLowerCase() as string)
                  setInfo(
                    (categories?.find((c) => c?.id === o?.value) as ICategory)
                      ?.info as string
                  )
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
              <div className='input-wrap'>
                <label htmlFor='category-edit-info'>Kategorian tarkenne: </label>
                <span className='input'>
                  <input
                    id='category-edit-info'
                    value={info}
                    onChange={(e) => {
                      setInfo(e.target.value)
                      setCategoryObject({
                        ...categoryObject,
                        info: e.target.value as string,
                        viimeisinMuokkaus: user?.id as number,
                      })
                    }}
                  />
                </span>
              </div>
              <button type='submit'>Tallenna</button>
            </>
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
                value={emptyCategory}
                onChange={(o) => {
                  setEmptyCategory(o as SelectOption)
                  setCategoryObject({
                    ...(categories?.find((c) => c?.id === o?.value) as ICategory),
                    viimeisinMuokkaus: user?.id as number,
                  })
                }}
                options={emptyOptions}
                instructions='Valitse kategoria'
                selectAnOption={emptyCategory?.label}
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
