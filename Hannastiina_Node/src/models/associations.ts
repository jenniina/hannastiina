import Palvelu from './palvelu'
import Jarjestys from './jarjestys'
import Kategoria from './kategoria'

Palvelu.belongsTo(Kategoria, { foreignKey: 'kategoria' })
Palvelu.hasOne(Jarjestys, { foreignKey: 'palveluId', as: 'jarjestys' })
Jarjestys.belongsTo(Palvelu, { foreignKey: 'palveluId', as: 'palvelu' })
