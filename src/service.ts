import { Infor, Movice, Play } from './entity';
import connection from './utils/db/db';

const moviceRepository = connection.getRepository(Movice);

const playRepository = connection.getRepository(Play);

const inforRepository = connection.getRepository(Infor);

export async function setMovice(movice: Movice) {
  // const findOneById = await moviceRepository.findOneBy({
  //   id: movice.id,
  // })
  // if (!findOneById) {
  const res = moviceRepository.create({
    ...movice,
  });
  await moviceRepository.save(res);
  // }
}

export async function getMoviceById(moviceid: string) {
  return await moviceRepository.findOneBy({
    id: moviceid,
  });
}

export async function getMovices() {
  return await moviceRepository.find();
}

export async function setPlay(play: Play) {
  // const findOneById = await playRepository.find({
  //   relations: {
  //     movice: true,
  //   },
  //   where: {
  //     id: play.id,
  //   },
  // })
  // if (findOneById) {
  //   //
  // }
  // else {
  const res = playRepository.create({
    ...play,
  });
  await playRepository.save(res);
}

export async function getPlaysFormDB() {
  await playRepository.find();
}

export async function setInfor(infor: Infor) {
  // const findOneById = await playRepository.find({
  //   relations: {
  //     movice: true,
  //   },
  //   where: {
  //     id: infor.id,
  //   },
  // })
  // if (findOneById) {
  //   //
  // }
  // else {
  const res = inforRepository.create({
    ...infor,
  });
  await inforRepository.save(res);
}
