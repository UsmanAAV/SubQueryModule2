import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {UsmanObject} from "../types";
import {Balance} from "@polkadot/types/interfaces";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    //Create a new UsmanObject with ID using block hash
    let record = new UsmanObject(block.block.header.hash.toString());
    //Record block number
    record.blockNumber = block.block.header.number.toNumber();
    await record.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [from, _to, value]}} = event;
    //Retrieve the record by its ID
    const record = await UsmanObject.get(event.extrinsic.block.block.header.hash.toString());
    record.account = from.toString();
    //Big integer type Balance of a transfer event
    record.value = (value as Balance).toBigInt();

    logger.info('\nMODULE: ' + event.event.method);
    logger.info('\nMETHOD: ' + event.event.section);
    logger.info('\nVALUE: ' + record.value);
    logger.info('\nFROM: ' + record.account);

    await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    const record = await UsmanObject.get(extrinsic.block.block.header.hash.toString());
    //Date type timestamp
    record.timestamp = extrinsic.block.timestamp;
    //Boolean tyep
    record.success = true;
    await record.save();
}


