import axios, {AxiosPromise} from 'axios'

const client = axios.create({
    // baseURL: '/api/notion',
    baseURL: 'https://www.notion.so/api/v3',
    headers: {
        'Access-Control-Allow-Origin': '*',
        // "Access-Control-Allow-Headers": "Content-Type",
        'Content-Type': 'application/json'
    },
    timeout: 1000000
});

export interface IRecordValue {
    value: {
        id: string,
        content: string[]
        version: number,
        type: string,
        format?: {
            page_cover: string,
            page_cover_position: number,
            block_aspect_ratio: number
            block_full_width: boolean
            block_page_width: boolean
            block_preserve_scale: boolean
            block_width: number,
            block_height: number,
            display_source: string
        }
        properties?: {
            language: string[],
            title: any[],
            source: string[]
        },
        created_time: number,
        last_edited_time: number,
        parent_id: string,
        parent_table: string,
        alive: boolean
    }
}

export interface IRecordValues {
    results: IRecordValue[]
}

export interface IPageChunk {
    cursor: {
        stack: []
    }
    recordMap: {
        block: {
            [blockId: string]: IRecordValue
        }
    }
}

export function getRecordValues(
    ...blockIds: string[]
): AxiosPromise<IRecordValues> {
    return client.post("/getRecordValues", {
        requests: blockIds.map(blockId => {
            return {
                id: getFullBlockId(blockId),
                table: 'block'
            }
        })
    })
}

export function loadPageChunk(
    pageId: string, count: number, cursor = {stack: []}
): AxiosPromise<IPageChunk> {
    return client.post("/loadPageChunk", {
        "cursor": cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false
    })
}

export function getFullBlockId(blockId: string): string {
    if (blockId.match("^[a-zA-Z0-9]+$")) {
        return blockId.substr(0, 8) + "-"
            + blockId.substr(8, 4) + "-"
            + blockId.substr(12, 4) + "-"
            + blockId.substr(16, 4) + "-"
            + blockId.substr(20, 32)
    } else {
        return blockId;
    }
}

export function getDisplayBlockId(blockId: string): string {
    if (blockId.match("^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]+$")) {
        return blockId.split("-").join("")
    } else {
        return blockId
    }
}