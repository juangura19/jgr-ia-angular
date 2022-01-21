export interface AzureRequest {
    faceId: string;
    faceIds: string[];
    maxNumOfCandidatesReturned: number;
    mode: string;
}