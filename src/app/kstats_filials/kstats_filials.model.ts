export class KstatsFilialsModel {

  id: number
  stat_cn: string
  npk: number

  constructor(id: number, stat_cn: string, npk: number) {
    this.id = id
    this.stat_cn = stat_cn
    this.npk = npk
  }

}
