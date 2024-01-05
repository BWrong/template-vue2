import { get } from '../../utils/request';
const prefix = '/system/config';
export default { list: (params) => get(`${prefix}`, params) };
