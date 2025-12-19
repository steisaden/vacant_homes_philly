import { VacantRow } from "@/types/vacant";

type ArcGisAttributes = Partial<{
    address: string;
    ADDRESS: string;
    zipcode: string;
    ZIPCODE: string;
    opa_account_num: string;
    OPA_ACCOUNT_NUM: string;
    indicator: string;
    INDICATOR: string;
    last_updated: string | number | Date;
    owner_1: string;
    OWNER_1: string;
    owner_name: string;
    luc_desc: string;
    LUC_DESC: string;
    last_inspection: string | number | Date;
}>;

type ArcGisGeometry = {
    x?: number;
    y?: number;
};

type ArcGisFeature = {
    attributes?: ArcGisAttributes;
    geometry?: ArcGisGeometry;
};

function coerceDate(dateLike: string | number | Date | undefined): string {
    if (!dateLike) return new Date().toISOString();
    const date = new Date(dateLike);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function normalizeArcGis(features: ArcGisFeature[]): VacantRow[] {
    return features.map((f) => {
        const a = f.attributes ?? {};
        const g = f.geometry ?? {};
        return {
            address: a.address || a.ADDRESS || "",
            zipcode: a.zipcode || a.ZIPCODE || "",
            opaAccount: a.opa_account_num || a.OPA_ACCOUNT_NUM || "",
            indicator: a.indicator || a.INDICATOR || "",
            lastUpdated: coerceDate(a.last_updated),
            lat: g.y ?? 0,
            lon: g.x ?? 0,
            ownerName: a.owner_1 || a.OWNER_1 || a.owner_name || "City of Philadelphia",
            propertyType: a.luc_desc || a.LUC_DESC || "Vacant Land",
            lastInspection: coerceDate(a.last_inspection),
        };
    });
}
