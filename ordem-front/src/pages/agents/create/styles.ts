import styled from 'styled-components';

export const Wrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.2rem;
`;

export const FormWrapper = styled.section`
  width: 80%;
  background-color: ${({ theme }) => theme.colors.midnight_900};
  padding: 3.2rem;
  border-radius: ${({ theme }) => theme.border.radius.medium};

  > div {
    margin-bottom: ${({ theme }) => theme.spacings.medium};

    h2 {
      color: ${({ theme }) => theme.colors.white};
      font-size: 3.2rem;
    }
  }
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${({ theme }) => theme.spacings.medium};
  grid-row-gap: ${({ theme }) => theme.spacings.medium};
`;

export const BooleanFields = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 1.6rem;
`;
