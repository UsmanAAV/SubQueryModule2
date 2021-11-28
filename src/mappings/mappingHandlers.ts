import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {StarterEntity} from "../types";
import {Balance} from "@polkadot/types/interfaces";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    //Create a new starterEntity with ID using block hash
    let record = new StarterEntity(block.block.header.hash.toString());
    //Record block number
    record.field1 = block.block.header.number.toNumber();
    await record.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [from, _to, value]}} = event;
    //Retrieve the record by its ID
    const record = await StarterEntity.get(event.extrinsic.block.block.header.hash.toString());
    record.field2 = from.toString();
    //Big integer type Balance of a transfer event
    record.field3 = (value as Balance).toBigInt();

    logger.info('\nMODULE: ' + event.event.method);
    logger.info('\nMETHOD: ' + event.event.section);
    logger.info('\nVALUE: ' + record.field3);
    logger.info('\nFROM: ' + record.field2);

    await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
    //Date type timestamp
    record.field4 = extrinsic.block.timestamp;
    //Boolean tyep
    record.field5 = true;
    await record.save();
}


