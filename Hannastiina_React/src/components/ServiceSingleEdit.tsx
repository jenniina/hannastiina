import React from 'react'
import Select, { SelectOption } from './Select'
import { IService, ICategory } from '../types'

interface IServiceSingleProps {
  service: IService
  categories: ICategory[]
  setCategory: (category: SelectOption) => void
  handleDelete: (id: number) => void
  editId: number
  setEditId: (id: number) => void
  editOpen: boolean
  setEditOpen: (open: boolean) => void
  setName: (name: string) => void
  setDetail: (detail: string) => void
  setPrice: (price: string) => void
  setPrice2: (price: string) => void
  setDuration: (duration: number) => void
  setDescription: (description: string) => void
  setAddOpen: (open: boolean) => void
  handleEditService: (event: React.FormEvent<HTMLFormElement>) => void
  category: SelectOption
  options: SelectOption[]
  name: string
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  detail: string
  price: string
  price2: string
  duration: number
  description: string
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handlePrice2Change: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  formatDuration: (minutes: number) => string
}

const ServiceSingleEdit: React.FC<IServiceSingleProps> = ({
  service,
  options,
  category,
  categories,
  setCategory,
  handleDelete,
  editId,
  setEditId,
  editOpen,
  setEditOpen,
  setName,
  setDetail,
  setPrice,
  setPrice2,
  setDuration,
  setDescription,
  setAddOpen,
  handleEditService,
  name,
  handleNameChange,
  detail,
  price,
  price2,
  duration,
  description,
  handlePriceChange,
  handlePrice2Change,
  handleDurationChange,
  handleDescriptionChange,
  formatDuration,
}) => {
  const kuvaus = service?.kuvaus?.split(/\n+/) ?? ['']

  return (
    <>
      <div>
        <div>
          <span>Palvelun nimi</span>
          <span>{service.nimi}</span>
        </div>
        <div>
          <span>Tarkennus</span>
          <span>{service.tarkennus}</span>
        </div>
        {service.hinta2 !== null ? (
          <>
            <div>
              <span>Minimihinta</span>
              <span>{service.hinta} €</span>
            </div>
            <div>
              <span>Maksimihinta</span>
              <span>{service.hinta2} €</span>
            </div>
          </>
        ) : (
          <div>
            <span>Hinta</span>
            <span>{service.hinta} €</span>
          </div>
        )}
        {Number(service.kesto) > 0 && (
          <div>
            <span>Kesto</span>
            <span>{formatDuration(service.kesto)}</span>
          </div>
        )}
        {kuvaus[0] !== '' ? (
          <div>
            <span>Kuvaus</span>
            <span>
              {kuvaus?.map((rivi, index) => {
                return <span key={index}>{rivi}</span>
              })}
            </span>
          </div>
        ) : (
          ''
        )}{' '}
      </div>
      <div className={`btn-wrap ${editOpen ? 'open' : ''}`}>
        <button className='danger' onClick={() => handleDelete(service.id as number)}>
          Poista
        </button>
        {editId !== service.id && (
          <button
            onClick={() => {
              const cat = categories?.find((c) => c.id === service.kategoria)
              const firstLetterCat = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
              const rest = cat?.kategoria.slice(1) ?? ''
              const kategoria = firstLetterCat + rest
              setCategory({
                value: cat?.id as number,
                label: kategoria as string,
              })
              setEditId(service.id as number)
              setEditOpen(true)
              setName(service.nimi)
              setDetail(service.tarkennus)
              setPrice(service.hinta.toString())
              setPrice2(service.hinta2?.toString() ?? '')
              setDuration(service.kesto)
              setDescription(service.kuvaus)
              setAddOpen(false)
            }}
          >
            Muokkaa
          </button>
        )}
      </div>{' '}
      {editId === service.id && editOpen && (
        <form onSubmit={handleEditService}>
          <legend>Muokkaa palvelua</legend>
          <div>
            <Select
              className='category-select'
              id='category-single'
              value={category}
              onChange={(o) => setCategory(o as SelectOption)}
              options={options}
              instructions='Valitse kategoria'
              selectAnOption='Valitse kategoria'
            />
          </div>
          <div className='input-wrap'>
            <label htmlFor='single-name'>
              <span>Palvelun nimi</span>
            </label>
            <span className='input'>
              <input required id='single-name' value={name} onChange={handleNameChange} />
            </span>
          </div>
          <div className='input-wrap'>
            <label htmlFor='single-detail'>
              <span>Tarkennus</span>
            </label>
            <span className='input'>
              <input
                id='single-detail'
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </span>
          </div>
          <div className='input-wrap'>
            <label htmlFor='single-price'>
              <span>Palvelun hinta tai minimihinta (€)</span>
            </label>
            <span className='input'>
              <input
                required
                id='single-price'
                type='text'
                value={price}
                onChange={handlePriceChange}
                pattern='^[0-9]*[.,]?[0-9]*$'
              />
            </span>
          </div>
          <div className='input-wrap'>
            <label htmlFor='single-price2'>
              <span>Palvelun maksimihinta (€)</span>
            </label>
            <span className='input'>
              <input
                id='single-price2'
                type='text'
                value={price2}
                onChange={handlePrice2Change}
                pattern='^[0-9]*[.,]?[0-9]*$'
              />
            </span>
          </div>
          <div className='input-wrap'>
            <label htmlFor='single-duration'>
              <span>Palvelun kesto (minuuteissa)</span>
            </label>
            <span className='input'>
              <input
                id='single-duration'
                value={duration}
                onChange={handleDurationChange}
              />
            </span>
          </div>
          <div>
            <label htmlFor='single-description'>
              <span>Palvelun kuvaus</span>
            </label>
            <textarea
              id='single-description'
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div className='flex start gap'>
            <button type='submit'>Tallenna</button>
            <button
              className='danger'
              onClick={() => {
                setEditOpen(false)
                setEditId(-1)
                setPrice2('')
              }}
            >
              Peruuta
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default ServiceSingleEdit
