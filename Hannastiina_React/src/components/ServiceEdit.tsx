import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/useAppDispatch'
import Accordion from './Accordion'
import Select, { SelectOption } from './Select'
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
} from '../reducers/serviceReducer'
import { fetchCategories } from '../reducers/categoryReducer'
import { fetchOrderBy } from '../reducers/orderByReducer'
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react'
import {
  IService,
  IReducers,
  IClosestItem,
  ICategoryItems,
  ICategory,
  IUser,
} from '../types'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import ServiceSingleEdit from './ServiceSingleEdit'
import { notify } from '../reducers/notificationReducer'

interface Props {
  user: IUser
  formatDuration: (minutes: number) => string
  handleScrollToElement: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void
  maxPrice: number
}

const ServiceEdit = ({
  user,
  formatDuration,
  handleScrollToElement,
  maxPrice,
}: Props) => {
  const dispatch = useAppDispatch()
  const { services, loading, error } = useSelector((state: IReducers) => state.services)
  const [filteredServices, setFilteredServices] = useState<IService[] | undefined>(
    undefined
  )
  const { categories } = useSelector((state: IReducers) => state.categories)

  const { listItemsByCategory, handleUpdate, handleDragging } = useDragAndDrop(
    filteredServices as IService[]
  )

  const cat = categories[0]
  const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
  const rest = cat?.kategoria.slice(1) ?? ''
  const kategoria = firstLetter + rest
  const [category_, setCategory] = useState<SelectOption>({
    value: categories[0]?.id as number,
    label: kategoria,
  })

  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [price, setPrice] = useState('')
  const [price2, setPrice2] = useState('')
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(300)
  const [searchName, setSearchName] = useState('')
  const [duration, setDuration] = useState(0)
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [filterBy, setFilterBy] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories()).catch((error) => console.error(error))
    dispatch(fetchOrderBy())
      .then(() => dispatch(fetchServices()))
      .catch((error) => console.error(error))
  }, [dispatch])

  const onDrop = async (id: number, category: string, targetIndex: number) => {
    handleUpdate(id, category, targetIndex)
      .then(() => dispatch(fetchServices()))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    if (filterBy === 'name') {
      setFilteredServices(
        services?.filter((service) =>
          service.nimi?.toLowerCase()?.includes(searchName?.toLowerCase())
        )
      )
    } else if (filterBy === 'price') {
      setFilteredServices(
        services?.filter((service) => service.hinta >= min && service.hinta <= max)
      )
    } else setFilteredServices(services)
  }, [services, filterBy, searchName, min, max])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSearchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterBy('name')
    setSearchName(event.target.value)
  }
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!isNaN(Number(value.replace(',', '.')))) {
      setPrice(value.replace(',', '.'))
    }
  }
  const handlePrice2Change = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!isNaN(Number(value.replace(',', '.')))) {
      setPrice2(value.replace(',', '.'))
    }
  }

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!isNaN(Number(value)) || value === '') {
      setDuration(Number(value))
    }
  }
  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const handleAddService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim() === '') {
      dispatch(notify('Palvelun nimi ei voi olla tyhjä', true, 5))
      return
    } else if (price.trim() === '') {
      dispatch(notify('Palvelun hinta ei voi olla tyhjä', true, 5))
      return
    } else if (price2.trim() !== '' && Number(price) >= Number(price2)) {
      dispatch(notify('Minimihinnan tulee olla pienempi kuin maksimihinnan', true, 5))
      return
    } else {
      const newService: IService = {
        nimi: name,
        kategoria: category_?.value as number,
        tarkennus: detail,
        hinta: Number(price.replace(',', '.')),
        hinta2:
          Number(price2.replace(',', '.')) == 0 ? null : Number(price2.replace(',', '.')),
        kesto: duration,
        kuvaus: description,
        viimeisinMuokkaus: user?.id as number,
      }
      await dispatch(addService(newService))
        .then((result) => {
          if (result.type === 'services/addService/rejected') {
            if ('payload' in result && result.payload !== undefined) {
              dispatch(notify(`${result.payload}`, true, 8))
            }
            dispatch(fetchServices())
            return
          } else dispatch(notify('Palvelu lisätty', false, 3))

          resetPlus()
          dispatch(fetchServices())
        })
        .catch((error) => {
          console.error(error)
          dispatch(notify(`Virhe! ${error.response.data.message ?? ''}`, true, 5))
        })
    }
  }

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

  const reset = () => {
    setEditOpen(false)
    setEditId(-1)
    setName('')
    setCategory(options[0])
    setDetail('')
    setPrice('')
    setPrice2('')
    setDuration(0)
    setDescription('')
  }

  const resetPlus = () => {
    reset()
    setAddOpen(false)
  }

  const handleSearchServiceByPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilterBy('price')
  }

  const allServices = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(fetchServices()).catch((error) => console.error(error))
    setEditOpen(false)
    setFilterBy('')
    setEditId(-1)
    setAddOpen(false)

    // const anchor = document.querySelector(`#palvelulista`)
    // if (anchor) {
    //   anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Haluatko varmasti poistaa palvelun? Poistoa ei voi peruuttaa.'))
      await dispatch(deleteService(id))
        .then((result) => {
          if (result.type === 'services/deleteService/rejected') {
            if ('payload' in result && result.payload !== undefined) {
              dispatch(notify(`${result.payload}`, true, 8))
            }
          } else dispatch(notify('Palvelu poistettu', false, 3))
          dispatch(fetchServices())
        })
        .catch((error) => {
          console.error(error)
          dispatch(notify(`Virhe! ${error.response.data.message ?? ''}`, true, 5))
        })
  }

  const handleEditService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (price2.trim() !== '' && Number(price) >= Number(price2)) {
      dispatch(notify('Minimihinnan tulee olla pienempi kuin maksimihinnan', true, 5))
      return
    } else {
      const editedService: IService = {
        nimi: name,
        kategoria: category_?.value as number,
        tarkennus: detail,
        hinta: Number(price.replace(',', '.')),
        hinta2:
          Number(price2.replace(',', '.')) == 0 ? null : Number(price2.replace(',', '.')),
        kesto: duration,
        kuvaus: description,
        viimeisinMuokkaus: user?.id as number,
      }
      dispatch(updateService({ id: editId, newObject: editedService }))
        .then((result) => {
          if (result.type === 'services/updateService/rejected') {
            if ('payload' in result && result.payload !== undefined) {
              dispatch(notify(`${result.payload}`, true, 8))
            }
            dispatch(fetchServices())
            return
          } else dispatch(notify('Palvelu päivitetty', false, 3))

          resetPlus()
          dispatch(fetchServices())
        })
        .catch((error) => {
          console.error(error)
          dispatch(notify(`Virhe! ${error.response.data.message ?? ''}`, true, 5))
        })
    }
  }

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
  }, [editOpen, addOpen])

  return (
    <div id='palvelut' className='edit'>
      <section className='card'>
        <h2>Palvelut</h2>

        <h3>Muokkaa palveluita</h3>
        <div className='controls'>
          <div className='input-wrap searchname'>
            <label htmlFor='searchname2'>
              <span>Etsi palvelua nimen perusteella</span>
            </label>
            <span className='input'>
              <input
                id='searchname2'
                placeholder='Etsi...'
                value={searchName}
                onChange={handleSearchNameChange}
              />
            </span>
          </div>
          <form className='minmax' onSubmit={(e) => handleSearchServiceByPrice(e)}>
            <legend>Rajaa hinnan perusteella</legend>
            <div>
              <label htmlFor='min2' className='scr'>
                Minimihinta
              </label>
              <input
                id='min2'
                className='narrow bg'
                type='number'
                min={0}
                name='min'
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
              &ndash;
              <label htmlFor='max2' className='scr'>
                Maksimihinta
              </label>
              <input
                id='max2'
                className='narrow bg'
                type='number'
                min={10}
                name='max'
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
              €
            </div>
            <button type='submit'>Rajaa</button>
            <button
              type='button'
              onClick={() => {
                setFilterBy('')
                setMin(0)
                setMax(maxPrice)
                setSearchName('')
              }}
            >
              Peru
            </button>
          </form>

          <button onClick={allServices}>Kaikki palvelut</button>

          <Accordion
            text='Lisää uusi palvelu tästä'
            className='add-service'
            id='add-service'
            onClick={() => {
              reset()
            }}
            isOpen={addOpen}
            setIsFormOpen={setAddOpen}
          >
            <>
              <h4>Lisää uusi palvelu</h4>
              <form onSubmit={(e) => handleAddService(e)}>
                <div>
                  <Select
                    className='category-select'
                    id='category-new'
                    value={category_}
                    onChange={(o) => setCategory(o as SelectOption)}
                    options={options}
                    instructions='Valitse kategoria'
                    selectAnOption='Valitse kategoria'
                  />
                </div>
                <div className='input-wrap'>
                  <label htmlFor='name'>Palvelun nimi</label>
                  <span className='input'>
                    <input
                      required
                      autoComplete='off'
                      id='name'
                      value={name}
                      onChange={handleNameChange}
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='detail'>Tarkennus</label>
                  <span className='input'>
                    <input
                      id='detail'
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='price'>Palvelun hinta tai minimihinta (€)</label>
                  <span className='input'>
                    <input
                      required
                      id='price'
                      type='text'
                      value={price}
                      onChange={handlePriceChange}
                      pattern='^[0-9]*[.,]?[0-9]*$'
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='price2'>Palvelun maksimihinta (€)</label>
                  <span className='input'>
                    <input
                      id='price2'
                      type='text'
                      value={price2}
                      onChange={handlePrice2Change}
                      pattern='^[0-9]*[.,]?[0-9]*$'
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='duration'>Palvelun kesto (minuuteissa)</label>
                  <span className='input'>
                    <input
                      id='duration'
                      value={duration}
                      onChange={handleDurationChange}
                    />
                  </span>
                </div>
                <div>
                  <label htmlFor='description'>Palvelun kuvaus</label>
                  <textarea
                    id='description'
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={5}
                  />
                </div>

                <button type='submit'>Lisää palvelu</button>
              </form>
            </>
          </Accordion>
        </div>
        <p>
          Vedä ja pudota palvelut haluamaasi järjestykseen kategoriansa sisällä. Uusi
          järjestys tallentuu automaattisesti. Paina palvelun "Muokkaa" painiketta
          halutessasi vaihtaa sen kategoriaa tai muuttaa muita tietoja.
        </p>
        <ul className='palvelulista' id='palvelulista'>
          {loading ? (
            <li>Ladataan...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            <>
              {listItemsByCategory &&
                Object.entries(listItemsByCategory as ICategoryItems)?.map(
                  ([category, services]) => {
                    if (services?.length === 0 && searchName !== '') {
                      return null // Don't render the category if there are no services
                    }
                    const foundCategory = categories.find(
                      (cat) => cat.kategoria.toLowerCase() === category.toLowerCase()
                    )
                    const firstLetter = category?.charAt(0)?.toUpperCase() ?? ''
                    const rest = category?.slice(1) ?? ''
                    const kategoria = `${firstLetter}${rest}`
                    return (
                      <li key={category} className={`kategoria`}>
                        <h3>{kategoria}</h3>
                        {foundCategory?.info && (
                          <strong className='info'>
                            Tarkenne: {foundCategory.info}{' '}
                            <button
                              className='smaller'
                              onClick={(e) => {
                                handleScrollToElement(e, 'muokkaa-kategoriaa')
                              }}
                            >
                              Muokkaa
                            </button>
                          </strong>
                        )}
                        <ul
                          className={`palvelut`}
                          onDragOver={(e) => {
                            e.preventDefault()
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            const draggedId = e.dataTransfer.getData('application/my-app')

                            // Find the closest item to the drop position
                            const closestItem = Array.from(
                              e.currentTarget.querySelectorAll('.palvelut > li')
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
                              e.currentTarget.querySelectorAll('.palvelut > li')
                            ).indexOf(closestItem.element as HTMLElement)

                            onDrop(Number(draggedId), category, newTargetIndex)
                          }}
                        >
                          {services?.map((service) => (
                            <li
                              className={`${editOpen ? 'open' : ''}`}
                              key={service?.id}
                              draggable={editId === service.id && editOpen ? false : true}
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  'application/my-app',
                                  service?.id?.toString() as string
                                )
                                e.dataTransfer.effectAllowed = 'move'
                                handleDragging(true)
                              }}
                              onDragEnd={() => handleDragging(false)}
                            >
                              <ServiceSingleEdit
                                service={service}
                                editOpen={editOpen}
                                setEditOpen={setEditOpen}
                                setAddOpen={setAddOpen}
                                editId={editId}
                                setEditId={setEditId}
                                setName={setName}
                                setCategory={setCategory}
                                setDetail={setDetail}
                                setPrice={setPrice}
                                setPrice2={setPrice2}
                                setDuration={setDuration}
                                setDescription={setDescription}
                                handleEditService={handleEditService}
                                handleDelete={handleDelete}
                                formatDuration={formatDuration}
                                name={name}
                                category={category_}
                                detail={detail}
                                price={price}
                                price2={price2}
                                duration={duration}
                                description={description}
                                options={options}
                                categories={categories}
                                handleNameChange={handleNameChange}
                                handlePriceChange={handlePriceChange}
                                handlePrice2Change={handlePrice2Change}
                                handleDurationChange={handleDurationChange}
                                handleDescriptionChange={handleDescriptionChange}
                              />
                            </li>
                          ))}
                          <li className='empty'>
                            <button
                              className='reset'
                              onClick={(e) => {
                                setAddOpen(true)
                                handleScrollToElement(e, 'add-service-container')
                              }}
                            >
                              Lisää palvelu
                            </button>
                          </li>
                        </ul>
                      </li>
                    )
                  }
                )}
            </>
          )}
        </ul>
      </section>
    </div>
  )
}

export default ServiceEdit
