import { VacantRow } from "@/types/vacant";

export function normalizeArcGis(features: any[]): VacantRow[] {
    return features.map((f) => {
        const a = f.attributes || {};
        const g = f.geometry || {};
        return {
            address: a.address || a.ADDRESS || "",
            zipcode: a.zipcode || a.ZIPCODE || "",
            opaAccount: a.opa_account_num || a.OPA_ACCOUNT_NUM || "",
            indicator: a.indicator || a.INDICATOR || "",
            lastUpdated: new Date(a.last_updated || Date.now()).toISOString(),
            lat: g.y,
            lon: g.x,
            ownerName: a.owner_1 || a.OWNER_1 || a.owner_name || "City of Philadelphia",
            propertyType: a.luc_desc || a.LUC_DESC || "Vacant Land",
            lastInspection: new Date(a.last_inspection || Date.now()).toISOString(),
        };
    });
}
