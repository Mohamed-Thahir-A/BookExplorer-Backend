export declare enum ScrapeTargetType {
    NAVIGATION = "navigation",
    CATEGORY = "category",
    PRODUCT = "product",
    PRODUCT_DETAIL = "product_detail"
}
export declare enum ScrapeJobStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class ScrapeJob {
    id: string;
    target_url: string;
    target_type: ScrapeTargetType;
    status: ScrapeJobStatus;
    started_at: Date;
    finished_at: Date;
    error_log: string;
}
