import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){
    
  }


  async executedSeed(){
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    

    const pokemonToInsert:{name: string, no: number}[] = [];




    data.results.forEach(({name, url}) => {
      
      const segments = url.split('/')
      const no: number = +segments [ segments.length - 2 ]
      
      // const pokemon = await this.pokemonModel.create({name, numeroPokemon})
      pokemonToInsert.push({name, no})
      


    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'seed executed'; 
  }

}
