const BASE =
    "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Vacant_Indicators_Bldg/FeatureServer/0/query";

export function buildArcGisUrl(zip: string) {
    const params = new URLSearchParams({
        where: `zipcode='${zip}'`,
        outFields: "*",
        f: "json",
        returnGeometry: "true"
    });

    return `${BASE}?${params.toString()}`;
}
