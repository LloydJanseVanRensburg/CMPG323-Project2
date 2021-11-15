// Core Node
import fs from 'fs';
import util from 'util';

export const unlinkFile = util.promisify(fs.unlink);
