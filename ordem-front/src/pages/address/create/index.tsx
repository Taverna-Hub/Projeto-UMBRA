import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Navigation } from '../../../components/Navigation';
import * as S from './styles';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

import axios from 'axios';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AddressService,
  CreateAddressProps,
} from '../../../services/http/address/AddressService';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../../utils/validationSchemas';
import { z } from 'zod';

export type ZipCodeProps = {
  logradouro: string;
  bairro: string;
  uf: string;
  localidade: string;
};

type AddressFormSchema = z.infer<typeof addressSchema>;

export function CreateAddress() {
  const navigate = useNavigate();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormSchema>({
    resolver: zodResolver(addressSchema),
  });
  const queryClient = useQueryClient();

  const zip_code = watch('postal_code');

  async function handleZipCodeChange() {
    const formattedZipCode = zip_code.split('-').join('');

    if (formattedZipCode.length === 8) {
      try {
        const { data } = await axios.get<ZipCodeProps>(
          `https://viacep.com.br/ws/${zip_code}/json/`,
        );

        setValue('street', data.logradouro);
        setValue('neighborhood', data.bairro);
        setValue('city', data.localidade);
        setValue('state', data.uf);
      } catch (error) {
        console.log(error);
        toast.error('Verifique se o CEP está certo.');
      }
    }
  }

  const { mutate } = useMutation({
    mutationFn: async (data: CreateAddressProps) => {
      await AddressService.create(data);
    },
    onSuccess: async () => {
      toast.success('Endereço cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['addressess'] });
      navigate('/missoes/criar');
    },
    onError: () => {
      toast.error('Ocorreu um erro ao cadastrar endereço!');
    },
  });

  function formatCep(cep: string) {
    const digits = cep.replace(/\D/g, '');
    if (digits.length === 8) {
      return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  }

  function handleCreateAddress(data: AddressFormSchema) {
    mutate({
      ...data,
      postal_code: formatCep(data.postal_code),
      number: Number(data.number),
    });
  }

  function handleCancelClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate('/missoes/criar');
  }

  return (
    <S.Wrapper>
      <Helmet title="Criar Endereço" />
      <S.FormWrapper>
        <div>
          <h2>Adicionar endereço</h2>
        </div>

        <S.Form onSubmit={handleSubmit(handleCreateAddress)}>
          <Input
            label="CEP"
            {...register('postal_code')}
            onBlur={handleZipCodeChange}
            maxLength={8}
            error={errors.postal_code?.message}
          />
          <Input
            label="Bairro"
            {...register('neighborhood')}
            error={errors.neighborhood?.message}
          />
          <Input
            label="Rua"
            {...register('street')}
            error={errors.street?.message}
          />
          <Input
            label="Numero"
            {...register('number')}
            error={errors.number?.message}
          />

          <Input
            label="Cidade"
            {...register('city')}
            error={errors.city?.message}
          />
          <Input
            label="Estado"
            {...register('state')}
            error={errors.state?.message}
          />

          <div />

          <S.Actions>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancelClick}
            >
              Não adicionar
            </Button>

            <Button type="submit">Adicionar novo endereço</Button>
          </S.Actions>
        </S.Form>
      </S.FormWrapper>

      <Navigation />
    </S.Wrapper>
  );
}
