export interface CreateReviewDto {
  overallRating: number;
  serviceQuality: number;
  professionalism: number;
  valueForMoney: number;
  comment?: string;
}

export function validateCreateReviewDto(body: any): { isValid: boolean; data?: CreateReviewDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const overall = Number(body.overallRating);
  const quality = Number(body.serviceQuality);
  const prof = Number(body.professionalism);
  const value = Number(body.valueForMoney);

  const isInvalidRating = (val: number) => isNaN(val) || !Number.isInteger(val) || val < 1 || val > 5;

  if (isInvalidRating(overall)) {
    return { isValid: false, error: 'overallRating must be an integer between 1 and 5' };
  }
  if (isInvalidRating(quality)) {
    return { isValid: false, error: 'serviceQuality must be an integer between 1 and 5' };
  }
  if (isInvalidRating(prof)) {
    return { isValid: false, error: 'professionalism must be an integer between 1 and 5' };
  }
  if (isInvalidRating(value)) {
    return { isValid: false, error: 'valueForMoney must be an integer between 1 and 5' };
  }

  return {
    isValid: true,
    data: {
      overallRating: overall,
      serviceQuality: quality,
      professionalism: prof,
      valueForMoney: value,
      comment: body.comment ? String(body.comment).trim() : undefined,
    },
  };
}
