import { FC, memo } from 'react'

const Map: FC = () => {
  return (
    <div className='public' id='yhteystiedot'>
      <div className='map-wrap'>
        <div>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d294.3930146329457!2d24.874211996998948!3d60.23976834107441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df63654a6bdf3%3A0x388683fe0982d30c!2sParturi%20Kampaamo%20Hannastiina!5e0!3m2!1sen!2sfi!4v1705919974506!5m2!1sen!2sfi'
            height='400'
            loading='lazy'
            title='Parturi Kampaamo Hannastiina'
          ></iframe>
        </div>
        <div className='contact'>
          <div>
            <h2>Yhteystiedot</h2>
            <p>
              <strong>Parturi Kampaamo Hannastiina</strong>{' '}
            </p>
            <p>
              <strong>Puhelin: </strong>{' '}
              <span>
                <a href='tel:095666124'>09 566 6124</a>
              </span>
            </p>
            <p>
              <strong>Osoite: </strong>
              <span>Sitratie 1, 00420 Helsinki</span>
            </p>
          </div>
          <div>
            <h2>Aukioloajat</h2>
            <p>Sopimuksen mukaan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Map)
