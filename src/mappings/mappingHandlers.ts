import {SubstrateEvent} from "@subql/types";
import {Account} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;

    const id = account.toString();
    const value = (balance as Balance).toBigInt();

    const existingRecord = await Account.get(id);

    if (existingRecord) {
        existingRecord.value = value;
        existingRecord.total = existingRecord.total + value;
        await existingRecord.save();
    } else {
        const record = new Account(id);
        record.account = id;
        record.value = value;
        record.total = value;
        logger.info('\nrecord ' + record);
        await record.save();
    }
}
